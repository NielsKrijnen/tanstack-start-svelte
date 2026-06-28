<script lang="ts">
  // TODO: Better solution

  import type { RouterManagedTag } from "@tanstack/router-core"
  import { isServer } from "@tanstack/router-core/isServer"
  import { onMount } from "svelte"

  let { tag, attrs, children, ...rest }: RouterManagedTag = $props()

  const isInlineCss = $derived(
    tag === "style" &&
      "inlineCss" in rest &&
      (process.env.TSS_INLINE_CSS_ENABLED === "true" || (process.env.TSS_INLINE_CSS_ENABLED === undefined && isServer))
  )

  const attrsString = $derived(
    attrs
      ? Object.entries(attrs)
          .map(([k, v]) => `${k}="${String(v).replace(/"/g, "&quot;")}"`)
          .join(" ")
      : ""
  )

  onMount(() => {
    if ((tag === "style" || tag === "script") && children) {
      const el = document.createElement(tag)
      if (attrs && attrsString) {
        Object.entries(attrs).forEach(([k, v]) => {
          el.setAttribute(k, String(v))
        })
      }
      el.textContent = children
      document.head.appendChild(el)

      return () => el.remove()
    }

    return () => {}
  })
</script>

<svelte:head>
  {#if tag === "title"}
    <title>{children}</title>
  {:else if tag === "meta"}
    <meta {...attrs}>
  {:else if tag === "link"}
    <link {...attrs}>
  {:else if (tag === "style" || tag === "script") && isServer}
    {@html `<${tag} ${attrsString}>${children}</${tag}>`}
  {/if}
</svelte:head>

{#if isInlineCss && isServer}
  {@html `<style ${attrsString}>${children}</style>`}
{/if}
