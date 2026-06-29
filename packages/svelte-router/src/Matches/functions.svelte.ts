import {
  type AnyRouter,
  type MakeRouteMatchUnion,
  type RegisteredRouter,
  replaceEqualDeep
} from "@tanstack/router-core"
import { getNearestMatchContext } from "../matchContext"
import { useRouter } from "../useRouter"
import type { UseMatchesBaseOptions, UseMatchesResult, UseMatchRouteOptions } from "./index"

export function useMatchRoute<TRouter extends AnyRouter = RegisteredRouter>() {
  const router = useRouter()

  return <
    const TFrom extends string = string,
    const TTo extends string | undefined = undefined,
    const TMaskFrom extends string = TFrom,
    const TMaskTo extends string = ""
  >(
    opts: UseMatchRouteOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo>
  ) => {
    return $derived.by(() => {
      const { pending, caseSensitive, fuzzy, includeSearch, ...rest } = opts

      router.stores.matchRouteDeps.get()
      // biome-ignore lint/suspicious/noExplicitAny: safe
      return router.matchRoute(rest as any, {
        pending,
        caseSensitive,
        fuzzy,
        includeSearch
      })
    })
  }
}

export function useMatches<TRouter extends AnyRouter = RegisteredRouter, TSelected = unknown>(
  opts?: UseMatchesBaseOptions<TRouter, TSelected>
): UseMatchesResult<TRouter, TSelected> {
  const router = useRouter<TRouter>()
  let prev: TSelected | undefined = $state()
  return $derived.by(() => {
    const matches = router.stores.matches.get() as Array<MakeRouteMatchUnion<TRouter>>
    const res = opts?.select ? opts.select(matches) : matches
    if (prev === undefined) return res
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return replaceEqualDeep(prev, res) as any
  })
}

export function useParentMatches<TRouter extends AnyRouter = RegisteredRouter, TSelected = unknown>(
  opts?: UseMatchesBaseOptions<TRouter, TSelected>
): UseMatchesResult<TRouter, TSelected> {
  const contextMatchId = $derived(getNearestMatchContext().matchId)

  return useMatches({
    select: (matches: Array<MakeRouteMatchUnion<TRouter>>) => {
      matches = matches.slice(
        0,
        matches.findIndex(d => d.id === contextMatchId)
      )
      return opts?.select ? opts.select(matches) : matches
    }
    // biome-ignore lint/suspicious/noExplicitAny: safe
  } as any)
}

export function useChildMatches<TRouter extends AnyRouter = RegisteredRouter, TSelected = unknown>(
  opts?: UseMatchesBaseOptions<TRouter, TSelected>
): UseMatchesResult<TRouter, TSelected> {
  const contextMatchId = $derived(getNearestMatchContext().matchId)

  return useMatches({
    select: (matches: Array<MakeRouteMatchUnion<TRouter>>) => {
      matches = matches.slice(matches.findIndex(d => d.id === contextMatchId) + 1)
      return opts?.select ? opts.select(matches) : matches
    }
    // biome-ignore lint/suspicious/noExplicitAny: safe
  } as any)
}
