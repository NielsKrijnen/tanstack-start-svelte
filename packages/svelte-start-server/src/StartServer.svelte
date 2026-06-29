<script lang="ts" generics="TRouter extends AnyRouter">
  // noinspection ES6UnusedImports
  import { AnyRouter } from "@tanstack/router-core"
  import { RouterProvider } from "tanstack-svelte-router"

  let { router }: { router: TRouter } = $props()
</script>

<RouterProvider {router} />
