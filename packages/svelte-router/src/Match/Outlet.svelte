<script lang="ts">
  import { rootRouteId } from "@tanstack/router-core"
  import { getNearestMatchContext } from "../matchContext"
  import { RenderRouteNotFound } from "../renderRouteNotFound"
  import Suspense from "../Suspense.svelte"
  import { useRouter } from "../useRouter"
  import Match from "./Match.svelte"

  const router = useRouter()
  const nearestParentMatch = getNearestMatchContext()
  const parentMatch = $derived(nearestParentMatch.match)
  const routeId = $derived(nearestParentMatch.routeId)
  const route = $derived(routeId ? router.routesById[routeId] : undefined)

  const parentGlobalNotFound = $derived(parentMatch?.globalNotFound ?? false)

  const childMatchId = $derived(routeId ? router.stores.childMatchIdByRouteId.get()[routeId] : undefined)

  const childMatchStatus = $derived(
    childMatchId ? router.stores.matchStores.get(childMatchId)?.get().status : undefined
  )

  const shouldShowNotFound = $derived(childMatchStatus !== "redirected" && parentGlobalNotFound)

  const childRouteKey = $derived(
    shouldShowNotFound
      ? undefined
      : childMatchId
        ? (router.stores.matchStores.get(childMatchId)?.routeId ?? childMatchId)
        : undefined
  )
</script>

{#if childRouteKey}
  {#if routeId === rootRouteId}
    <Suspense>
      {#snippet fallback()}
        {@const Component = router.options.defaultPendingComponent}
        <Component />
      {/snippet}
      <Match matchId={childMatchId!} />
    </Suspense>
  {:else}
    <Match matchId={childMatchId!} />
  {/if}
{:else if shouldShowNotFound && route}
  <RenderRouteNotFound {router} {route} data={undefined} />
{/if}
