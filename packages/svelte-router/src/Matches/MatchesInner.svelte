<script lang="ts">
  import { rootRouteId } from "@tanstack/router-core"
  import { CatchBoundary, ErrorComponent } from "../CatchBoundary"
  import { setNearestMatchContext } from "../matchContext"
  import { useRouter } from "../useRouter"

  const router = useRouter()

  const matchId = $derived(router.stores.firstId.get())
  const routeId = $derived(matchId ? rootRouteId : undefined)
  const match = $derived(routeId ? router.stores.getRouteMatchStore(rootRouteId).get() : undefined)
  const hasPendingMatch = $derived(routeId ? Boolean(router.stores.pendingRouteIds.get()[rootRouteId]) : false)
  const resetKey = $derived(router.stores.loadedAt.get())
  const nearestMatch = $derived({
    matchId,
    routeId,
    match,
    hasPending: hasPendingMatch
  })

  $effect(() => {
    setNearestMatchContext(nearestMatch)
  })
</script>

{#snippet MatchComponent()}
  {#if matchId}
    <Match {matchId} />
  {/if}
{/snippet}

{#if router.options.disableGlobalCatchBoundary}
  {@render MatchComponent()}
{:else}
  <CatchBoundary
    {resetKey}
    errorComponent={ErrorComponent}
    onCatch={
      process.env.NODE_ENV !== "production"
        ? error => {
          console.warn(
            `Warning: The following error wasn't caught by any route! At the very least, consider setting an 'errorComponent' in your RootRoute!`,
          )
          console.warn(`Warning: ${error.message || error.toString()}`)
        }
        : undefined
    }
  >
    {@render MatchComponent()}
  </CatchBoundary>
{/if}
