<script lang="ts" module>
  import type {
    HydrationStrategy as CoreHydrationStrategy,
    HydrationPrefetchFunction,
    HydrationPrefetchStrategy,
    HydrationWhen
  } from "@tanstack/start-client-core/hydration"
  import type { Snippet } from "svelte"

  export type SvelteHydrationStrategy<
    TWhen extends HydrationWhen = HydrationWhen,
    TCanPrefetch extends boolean = boolean
  > = CoreHydrationStrategy<TWhen, TCanPrefetch> & {
    _h: Snippet<[HydrateProps]>
  }

  export type HydrationStrategy<
    TWhen extends HydrationWhen = HydrationWhen,
    TCanPrefetch extends boolean = boolean
  > = SvelteHydrationStrategy<TWhen, TCanPrefetch>

  export type HydrateWhen = SvelteHydrationStrategy | (() => SvelteHydrationStrategy)

  type HydrateCommonOptions = {
    when: HydrateWhen
    fallback?: Snippet
    onHydrated?: () => void
  }

  export type HydrateOptions =
    | (HydrateCommonOptions & { prefetch?: never; split?: boolean })
    | (HydrateCommonOptions & { prefetch: HydrationPrefetchStrategy; split?: true })
    | (HydrateCommonOptions & { prefetch: HydrationPrefetchFunction; split?: boolean })

  export type HydrateProps = HydrateOptions & {
    children: Snippet
  }

  export type InternalHydrateProps = HydrateProps & {
    h?: string
    p?: () => Promise<void>
  }
</script>
<script lang="ts">
  let props: HydrateProps = $props()
</script>

{#if typeof props.when === "function" || typeof props.prefetch === "function"}
<!-- <GenericHydrate {...(props as InternalHydrateProps)} /> -->
{:else}
  {@render props.when._h(props)}
{/if}
