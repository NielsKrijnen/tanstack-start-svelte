<script lang="ts">
  import type { AnyRoute, AnyRouter } from "@tanstack/router-core"
  import { DefaultGlobalNotFound } from "../not-found"

  // biome-ignore lint/suspicious/noExplicitAny: safe
  let { router, route, data }: { router: AnyRouter; route: AnyRoute; data: any } = $props()

  $effect(() => {
    if (!route.options.notFoundComponent && process.env.NODE_ENV !== "production") {
      console.warn(
        `Warning: A notFoundError was encountered on the route with ID "${route.id}", but a notFoundComponent option was not configured, nor was a router level defaultNotFoundComponent configured. Consider configuring at least one of these to avoid TanStack Router's overly generic defaultNotFoundComponent (<p>Not Found</p>)`
      )
    }
  })
</script>

{#if !route.options.notFoundComponent}
  {#if router.options.defaultNotFoundComponent}
    {@const Component = router.options.defaultNotFoundComponent}
    <Component {...data} />
  {:else}
    <DefaultGlobalNotFound />
  {/if}
{:else}
  {@const Component = route.options.notFoundComponent}
  <Component {...data} />
{/if}
