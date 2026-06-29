import type { AnyRouteMatch } from "@tanstack/router-core"
import { createContext } from "svelte"

export type NearestMatchContextValue = {
  matchId: string | undefined
  routeId: string | undefined
  match: AnyRouteMatch | undefined
  hasPending: boolean
}

export const [getNearestMatchContext, setNearestMatchContext] = createContext<NearestMatchContextValue>()
