<script
  lang="ts"
  generics="TRouter extends AnyRouter = RegisteredRouter, TDehydrated extends Record<string, any> = Record<string, any>"
>
  // noinspection ES6UnusedImports
  import type { AnyRouter, RegisteredRouter } from "@tanstack/router-core"
  import type { Snippet } from "svelte"
  import { setRouterContext } from "../routerContext"
  import type { RouterProps } from "./index"

  type Props = Omit<RouterProps<TRouter, TDehydrated>, "$$render"> & {
    children: Snippet
  }

  let { router, children, ...rest }: Props = $props()

  $effect(() => {
    router.update({
      ...router.options,
      ...rest,
      context: {
        ...router.options.context,
        ...rest.context
      }
    })
  })

  $effect(() => {
    setRouterContext(router)
  })
</script>

{#if router.options.Wrap}
  {@const Wrap = router.options.Wrap}
  <Wrap {children} />
{:else}
  {@render children()}
{/if}
