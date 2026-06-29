<script
  lang="ts"
  generics="TRouter extends AnyRouter = RegisteredRouter, TDehydrated extends Record<string, any> = Record<string, any>"
>
  // noinspection ES6UnusedImports
  import type { AnyRouter, RegisteredRouter } from "@tanstack/router-core"
  import { Matches } from "../Matches"
  import type { RouterProps } from "./index"
  import RouterContextProvider from "./RouterContextProvider.svelte"

  let { router, ...rest }: RouterProps<TRouter, TDehydrated> = $props()
</script>

<RouterContextProvider {router} {...rest}>
  <Matches />
</RouterContextProvider>
