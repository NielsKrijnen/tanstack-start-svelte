<script
  lang="ts"
  generics="
    TRouter extends AnyRouter = RegisteredRouter,
    const TFrom extends string = string,
    const TTo extends string | undefined = undefined,
    const TMaskFrom extends string = TFrom,
    const TMaskTo extends string = ''
  "
>
  // noinspection ES6UnusedImports
  import type { AnyRouter, RegisteredRouter } from "@tanstack/router-core"
  import { type MakeMatchRouteOptions, useMatchRoute } from "./index"

  let props: MakeMatchRouteOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> = $props()

  const matchRoute = useMatchRoute()
  // biome-ignore lint/suspicious/noExplicitAny: safe
  const params = $derived(matchRoute(props as any))
</script>

{@render props.children(params)}
