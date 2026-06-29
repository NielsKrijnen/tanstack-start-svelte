<script lang="ts">
  import type { SSROption } from "@tanstack/router-core"
  import { useRouter } from "../useRouter"

  let {
    currentMatchState
  }: {
    currentMatchState: {
      matchId: string
      routeId: string
      ssr: SSROption | undefined
      _displayPending: boolean | undefined
      parentRouteId: string | undefined
    }
  } = $props()

  const router = useRouter()

  const route = $derived(router.routesById[currentMatchState.routeId])

  const resolvePendingComponent = $derived(route)
</script>
