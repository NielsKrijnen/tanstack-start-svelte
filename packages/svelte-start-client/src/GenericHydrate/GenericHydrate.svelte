<script lang="ts" module>
  import { hydrateIdAttribute, hydrateWhenAttribute } from "@tanstack/start-client-core/hydration"
  import type { HTMLAttributes } from "svelte/elements"

  type HydrationFallbackDynamicProps = HTMLAttributes<HTMLDivElement> & { component: "div" }
  // biome-ignore lint/correctness/noUnusedVariables: false-positive
  type HydrationMarkerDynamicProps = HydrationFallbackDynamicProps & {
    [hydrateIdAttribute]: string
    [hydrateWhenAttribute]: HydrationWhen
    [key: `data-${string}`]: string | undefined
  }
  // biome-ignore lint/correctness/noUnusedVariables: false-positive
  type PrefetchController = {
    abortController: AbortController
    hydrationRequested: boolean
    hydrationListeners: Set<() => void>
    hydrationResolvePending: boolean
    started: boolean
    promise?: Promise<void>
  }

  const hydrateIdSelector = `[${hydrateIdAttribute}]`
  const dynamicType = "dynamic"
  const dynamicHydrateStrategy = {
    _t: dynamicType,
    _d: () => true
  } satisfies HydrationStrategy<typeof dynamicType, false>

  // biome-ignore lint/correctness/noUnusedVariables: false-positive
  function shouldDeferHydration(strategy: HydrationStrategy) {
    return strategy._d ? strategy._d() : strategy._t !== "load"
  }
</script>
<script lang="ts">
  import { isServer } from "@tanstack/router-core/isServer"
  import {
    createResolvedGate,
    getFallbackHtml,
    getOrCreateGate,
    type HydrationGateRecord,
    type HydrationRuntimeContext,
    type HydrationStrategy,
    type HydrationWhen,
    listenForDelegatedHydrationIntent,
    onGateResolve,
    releaseGate,
    runHydrationStrategyCleanup,
    saveFallbackHtml,
    waitForHydrationPrefetchStrategy
  } from "@tanstack/start-client-core/hydration"
  import { onDestroy, onMount } from "svelte"
  import { useHydrated } from "tanstack-svelte-router"
  import type { InternalHydrateProps } from "../Hydrate"
  import HydrationBoundary from "./HydrationBoundary.svelte"

  let { when, ...rest }: InternalHydrateProps = $props()

  const initialHydrateStrategy: HydrationStrategy = $derived(
    typeof when === "function" ? ((isServer ?? typeof window === "undefined") ? dynamicHydrateStrategy : when()) : when
  )
  const markerHydrateType: HydrationWhen = $derived(
    // biome-ignore lint/style/noNonNullAssertion: safe
    typeof when === "function" ? dynamicType : initialHydrateStrategy._t!
  )
  const prefetchStrategy = $derived(rest.prefetch)
  const hydrated = useHydrated() as boolean
  const uniqueId = $props.id()
  const id = $derived(rest.h ? `${rest.h}${uniqueId}` : uniqueId)
  // biome-ignore lint/style/noNonNullAssertion: safe
  const initialHydrateType = $derived(initialHydrateStrategy._t!)
  const shouldPreserveServerHTML = (isServer ?? typeof window === "undefined") || !hydrated
  const shouldDeferInitialHydration = $derived(!hydrated && shouldDeferHydration(initialHydrateStrategy))
  const gate: HydrationGateRecord = $derived(
    (isServer ?? typeof window === "undefined")
      ? createResolvedGate(id, initialHydrateType)
      : getOrCreateGate(id, initialHydrateType)
  )
  let ready = $derived(
    (isServer ?? typeof window === "undefined") || (!shouldDeferInitialHydration && initialHydrateType !== "never")
  )
  let prefetchError = $state<unknown>()
  const controller: PrefetchController = {
    abortController: new AbortController(),
    hydrationRequested: false,
    hydrationListeners: new Set<() => void>(),
    hydrationResolvePending: false,
    started: false
  }
  let didPrefetch = false
  let markerElement: HTMLDivElement | undefined = $state()

  $effect(() => {
    if (
      !(isServer ?? typeof window === "undefined") &&
      initialHydrateType !== "never" &&
      (!shouldDeferInitialHydration || !shouldDeferHydration(initialHydrateStrategy))
    ) {
      gate.resolve()
    }
  })

  const onHydrate = (listener: () => void) => {
    if (controller.hydrationRequested) {
      listener()
      return () => {}
    }

    controller.hydrationListeners.add(listener)
    return () => {
      controller.hydrationListeners.delete(listener)
    }
  }

  const requestHydration = () => {
    if (!controller.hydrationRequested) {
      controller.hydrationRequested = true
      controller.hydrationListeners.forEach(listener => {
        listener()
      })
      controller.hydrationListeners.clear()
    }

    if (!controller.promise) {
      resolveGate()
      return
    }
    if (controller.hydrationResolvePending) return
    controller.hydrationResolvePending = true

    controller.promise.then(
      () => resolveGate(),
      error => {
        if (!controller.abortController.signal.aborted) {
          prefetchError = error
        }
      }
    )
  }
  const resolveGate = $derived(gate.resolve)

  onMount(() => {
    const currentHydrateStrategy = initialHydrateStrategy
    const currentPrefetchStrategy = prefetchStrategy
    // biome-ignore lint/style/noNonNullAssertion: safe
    const currentHydrateType = currentHydrateStrategy._t!
    gate.when = currentHydrateType
    for (const element of document.querySelectorAll<HTMLDivElement>(hydrateIdSelector)) {
      if (element.getAttribute(hydrateIdAttribute) === id) {
        markerElement = element
        saveFallbackHtml(id, element)
        break
      }
    }

    if (currentHydrateType === "never" && !shouldPreserveServerHTML && markerElement) {
      markerElement.replaceChildren()
    }

    if (currentPrefetchStrategy && !controller.started) {
      controller.started = true
      const preload = () => rest.p?.() ?? Promise.resolve()

      if (typeof currentPrefetchStrategy === "function") {
        const promise = Promise.resolve()
          .then(() =>
            currentPrefetchStrategy({
              element: markerElement ?? null,
              signal: controller.abortController.signal,
              preload,
              waitFor: strategy =>
                waitForHydrationPrefetchStrategy(strategy, {
                  element: markerElement ?? null,
                  signal: controller.abortController.signal,
                  onHydrate
                })
            })
          )
          .then(() => undefined)

        controller.promise = promise
        promise.catch(error => {
          if (!controller.abortController.signal.aborted) {
            prefetchError = error
          }
        })
      } else if (rest.p) {
        const currentStrategy = currentPrefetchStrategy
        const prefetch = () => {
          if (didPrefetch) return
          didPrefetch = true
          void preload()
        }
        const cleanupPrefetch = runHydrationStrategyCleanup(
          currentStrategy._s?.({
            element: markerElement ?? null,
            prefetch
          })
        )
        if (cleanupPrefetch) onDestroy(cleanupPrefetch)
      }
    }

    if (
      currentHydrateType !== "never" &&
      (!shouldDeferInitialHydration || !shouldDeferHydration(currentHydrateStrategy))
    ) {
      gate.resolve()
      ready = true
    }

    const cleanups: Array<() => void> = []
    let removeResolveListener = () => {}
    let disposed = false

    const resolveBoundary = () => {
      ready = true
    }

    const cleanup = () => {
      if (disposed) return
      disposed = true
      if (gate.resolve === requestHydration) {
        gate.resolve = resolveGate
      }
      removeResolveListener()
      cleanups.forEach(fn => {
        fn()
      })
    }

    // biome-ignore lint/suspicious/noConfusingVoidType: safe
    const addCleanup = (fn: void | (() => void)) => {
      if (!fn) return
      if (disposed || gate.resolved) {
        fn()
        return
      }
      cleanups.push(fn)
    }

    onDestroy(() => {
      controller.abortController.abort()
      controller.hydrationListeners.clear()
      cleanup()
      releaseGate(gate)
    })

    removeResolveListener = onGateResolve(gate, () => {
      cleanup()
      resolveBoundary()
    })

    if (gate.resolved || !shouldDeferInitialHydration || currentHydrateType === "never") {
      if (gate.resolved) resolveBoundary()
      return
    }

    gate.resolve = requestHydration
    const context: HydrationRuntimeContext = {
      element: markerElement ?? null,
      gate
    }
    addCleanup(runHydrationStrategyCleanup(currentHydrateStrategy._s?.(context)))

    if (currentHydrateStrategy._t !== "interaction") {
      addCleanup(
        runHydrationStrategyCleanup(
          markerElement ? listenForDelegatedHydrationIntent(markerElement, context) : undefined
        )
      )
    }
  })

  $effect.pre(() => {
    if (
      (isServer ?? typeof window === "undefined") ||
      gate.resolved ||
      initialHydrateStrategy._t === "never" ||
      shouldDeferHydration(initialHydrateStrategy)
    ) {
      return
    }

    gate.resolve()
  })

  $effect.pre(() => {
    if (prefetchError) throw prefetchError
  })

  const markerAttributes = $derived(markerHydrateType === dynamicType ? undefined : initialHydrateStrategy._a?.())
  const markerProps: HydrationMarkerDynamicProps = $derived({
    component: "div",
    [hydrateIdAttribute]: id,
    [hydrateWhenAttribute]: markerHydrateType,
    ...markerAttributes
  })
</script>

{#snippet fallback()}
  {#if !shouldPreserveServerHTML}
    {@render rest.fallback?.()}
  {:else}
    {@const html = getFallbackHtml(id)}
    {#if html}
      <div style="display: contents">{@html html}</div>
    {/if}
  {/if}
{/snippet}

<div {...markerProps}>
  {#if initialHydrateType === "never" && !shouldPreserveServerHTML}
    {@render rest.fallback?.()}
  {:else}
    <HydrationBoundary {fallback} {ready} {id} {initialHydrateStrategy} onHydrated={rest.onHydrated} {markerElement} children={rest.children} />
  {/if}
</div>
