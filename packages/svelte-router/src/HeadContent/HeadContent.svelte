<script lang="ts">
  import { Asset } from "../Asset"
  import { useTags } from "../headContentUtils.svelte"
  import type { HeadContentProps } from "./index"

  let { assetCrossOrigin }: HeadContentProps = $props()

  const tags = $derived(useTags(assetCrossOrigin))
</script>

<!--
@component
@description The `HeadContent` component is used to render meta tags, links, and scripts for the current route.
When using full document hydration (hydrating from `<html>`), this component should be rendered in the `<body>`
to ensure it's part of the reactive tree and updates correctly during client-side navigation.
The component uses portals internally to render content into the `<head>` element.
-->

{#each tags as tag}
  <Asset {...tag} />
{/each}
