<script lang="ts">
  import { onMount, type Snippet } from "svelte"

  let {
    id,
    onHydrated,
    onStrategyHydrated,
    children
  }: { id: string; onHydrated?: () => void; onStrategyHydrated?: (id: string) => void; children: Snippet } = $props()

  let didHydrate = false

  onMount(() => {
    if (didHydrate) return
    didHydrate = true
    onHydrated?.()
    onStrategyHydrated?.(id)
  })
</script>

{@render children()}
