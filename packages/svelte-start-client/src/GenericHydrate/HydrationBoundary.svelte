<script lang="ts">
  import type { Snippet } from "svelte"
  import HydratedBoundary from "./HydratedBoundary.svelte"
  import { hydrateWhenAttribute, HydrationStrategy } from "@tanstack/start-client-core/hydration"

  let {
    fallback,
    ready,
    id,
    onHydrated,
    markerElement,
    initialHydrateStrategy,
    children
  }: {
    fallback: Snippet
    ready: boolean
    id: string
    onHydrated: (() => void) | undefined
    markerElement: HTMLDivElement | undefined
    initialHydrateStrategy: HydrationStrategy
    children: Snippet
  } = $props()
</script>

<svelte:boundary>
  {#snippet pending()}
    {@render fallback()}
  {/snippet}
  {#snippet failed()}
    {@render fallback()}
  {/snippet}
  {#if ready}
    <HydratedBoundary
      {id}
      {onHydrated}
      onStrategyHydrated={id => {
        markerElement?.removeAttribute(hydrateWhenAttribute)
        initialHydrateStrategy._o?.(id)
      }}
    >
      {@render children()}
    </HydratedBoundary>
  {:else}
    {@render fallback()}
  {/if}
</svelte:boundary>
