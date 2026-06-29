<script lang="ts">
  import type { Snippet } from "svelte"
  import { HeadContent } from "../HeadContent"

  let { children }: { children: Snippet } = $props()
</script>

<HeadContent />
{@render children()}
