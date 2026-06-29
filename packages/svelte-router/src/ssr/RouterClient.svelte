<script lang="ts">
  import type { AnyRouter } from "@tanstack/router-core"
  import { hydrate } from "@tanstack/router-core/ssr/client"

  let { router }: { router: AnyRouter } = $props()

  let hydrationPromise: Promise<void | Array<Array<void>>> | undefined = $state()

  $effect(() => {
    if (!hydrationPromise) {
      if (!router.stores.matchesId.get().length) {
        hydrationPromise = hydrate(router)
      } else {
        hydrationPromise = Promise.resolve()
      }
    }
  })
</script>

{#await hydrationPromise then _}
  <RouterProvider></RouterProvider>
{/await}
