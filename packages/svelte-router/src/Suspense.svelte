<script lang="ts">
  import type { Snippet } from "svelte"

  let { fallback, children }: { fallback: Snippet; children: Snippet } = $props()
</script>

<svelte:boundary>
  {#snippet pending()}
    {@render fallback()}
  {/snippet}
  {@render children()}
</svelte:boundary>
