<script lang="ts">
  import type { Snippet } from "svelte"
  import type { ErrorRouteComponent } from "../route"
  import ErrorComponent from "./ErrorComponent.svelte"
  import ResetOnKeyChange from "./ResetOnKeyChange.svelte"

  let {
    resetKey,
    children,
    errorComponent,
    onCatch
  }: {
    resetKey: number | string
    children: Snippet
    errorComponent?: ErrorRouteComponent
    onCatch?: (error: Error) => void
  } = $props()

  const RenderedError = $derived(errorComponent ?? ErrorComponent)
</script>

<svelte:boundary onerror={(error) => onCatch?.(error as Error)}>
  {@render children()}
  {#snippet failed(error, reset)}
    <ResetOnKeyChange {resetKey} {reset} />
    <RenderedError error={error as Error} {reset} />
  {/snippet}
</svelte:boundary>
