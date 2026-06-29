import {
  type AnyRouter,
  invariant,
  type MakeRouteMatch,
  type MakeRouteMatchUnion,
  type RegisteredRouter,
  replaceEqualDeep,
  type StrictOrFrom,
  type ThrowConstraint,
  type ThrowOrOptional
} from "@tanstack/router-core"
import { getNearestMatchContext } from "./matchContext"
import { useRouter } from "./useRouter"

export type UseMatchBaseOptions<
  TRouter extends AnyRouter,
  TFrom,
  TStrict extends boolean,
  TThrow extends boolean,
  TSelected
> = {
  select?: (match: MakeRouteMatch<TRouter["routeTree"], TFrom, TStrict>) => TSelected
  shouldThrow?: TThrow
}

export type UseMatchRoute<out TFrom> = <TRouter extends AnyRouter = RegisteredRouter, TSelected = unknown>(
  opts?: UseMatchBaseOptions<TRouter, TFrom, true, true, TSelected>
) => () => UseMatchResult<TRouter, TFrom, true, TSelected>

export type UseMatchOptions<
  TRouter extends AnyRouter,
  TFrom extends string | undefined,
  TStrict extends boolean,
  TThrow extends boolean,
  TSelected
> = StrictOrFrom<TRouter, TFrom, TStrict> & UseMatchBaseOptions<TRouter, TFrom, TStrict, TThrow, TSelected>

export type UseMatchResult<
  TRouter extends AnyRouter,
  TFrom,
  TStrict extends boolean,
  TSelected
> = unknown extends TSelected
  ? TStrict extends true
    ? MakeRouteMatch<TRouter["routeTree"], TFrom, TStrict>
    : MakeRouteMatchUnion<TRouter>
  : TSelected

export function useMatch<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string | undefined = undefined,
  TStrict extends boolean = true,
  TThrow extends boolean = true,
  TSelected = unknown
>(
  opts: UseMatchOptions<TRouter, TFrom, TStrict, ThrowConstraint<TStrict, TThrow>, TSelected>
): { get current(): ThrowOrOptional<UseMatchResult<TRouter, TFrom, TStrict, TSelected>, TThrow> } {
  const router = useRouter<TRouter>()
  const nearestMatch = opts.from ? undefined : getNearestMatchContext()

  const match = $derived.by(() => {
    if (opts.from) {
      return router.stores.getRouteMatchStore(opts.from).get()
    }
    return nearestMatch?.match
  })

  $effect(() => {
    if (match !== undefined) {
      return
    }

    const hasPendingMatch = opts.from
      ? Boolean(router.stores.pendingIds.get()[opts.from])
      : (nearestMatch?.hasPending ?? false)

    if (!hasPendingMatch && !router.stores.isTransitioning.get() && (opts.shouldThrow ?? true)) {
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          `Invariant failed: Could not find ${opts.from ? `an active match from "${opts.from}"` : "a nearest match!"}`
        )
      }

      invariant()
    }
  })

  let prev: TSelected | undefined = $state(undefined)

  const selected = $derived.by(() => {
    if (match === undefined) {
      const hasPendingMatch = opts.from
        ? Boolean(router.stores.pendingIds.get()[opts.from])
        : (nearestMatch?.hasPending ?? false)

      if (prev !== undefined && (hasPendingMatch || router.stores.isTransitioning.get())) {
        return prev
      }

      return undefined
    }

    const res = (opts.select ? opts.select(match) : match) as TSelected
    const next = prev === undefined ? res : (replaceEqualDeep(prev, res) as TSelected)
    prev = next
    return next
  })

  return {
    get current() {
      return selected
    }
  }
}
