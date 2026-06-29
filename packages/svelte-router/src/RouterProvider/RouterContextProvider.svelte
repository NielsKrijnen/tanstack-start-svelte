<script lang="ts" generics="TRouter, TDehydrated extends Record<string, any> = Record<string, any>">
  import type { AnyRouter, RegisteredRouter } from "@tanstack/router-core"
  import type { Snippet } from "svelte"
  import type { RouterProps } from "./index"

  type Props = RouterProps<TRouter, TDehydrated> & {
    children: Snippet
  }

  let { router, children, ...rest }: Props = $props()
</script>

{#snippet content()}
  <div></div>
{/snippet}

{#if router.options.Wrap}
  {@const Wrap = router.options.Wrap}
  <Wrap children={content} />
{:else}
  {@render content()}
{/if}
