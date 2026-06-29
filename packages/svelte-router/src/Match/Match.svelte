<script lang="ts">
  import type { AnyRoute } from "@tanstack/router-core"
  import { useRouter } from "../useRouter"
  import MatchContent from "./MatchContent.svelte"

  let { matchId }: { matchId: string } = $props()

  const router = useRouter()

  const match = $derived(matchId ? router.stores.matchStores.get(matchId)?.get() : undefined)

  const rawMatchState = $derived.by(() => {
    if (!match) return null

    const routeId = match.routeId as string
    const parentRouteId = (router.routesById[routeId] as AnyRoute)?.parentRoute?.id

    return {
      matchId: match.id,
      routeId,
      ssr: match.ssr,
      _displayPending: match._displayPending,
      parentRouteId: parentRouteId as string | undefined
    }
  })

  const hasPendingMatch = $derived(
    rawMatchState?.routeId ? Boolean(router.stores.pendingRouteIds.get()[rawMatchState.routeId]) : false
  )
  const nearestMatch = $derived({
    matchId: rawMatchState?.matchId,
    routeId: rawMatchState?.routeId,
    match,
    hasPending: hasPendingMatch
  })
</script>

{#if rawMatchState}
  <MatchContent currentMatchState={rawMatchState} />
{/if}
