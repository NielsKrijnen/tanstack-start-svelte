import {
  type AnyRoute,
  createNonReactiveMutableStore,
  createNonReactiveReadonlyStore,
  type GetStoreConfig,
  type RouterReadableStore,
  type RouterStores,
  type RouterWritableStore
} from "@tanstack/router-core"
import { isServer } from "@tanstack/router-core/isServer"

declare module "@tanstack/router-core" {
  export interface RouterStores<in out TRouteTree extends AnyRoute> {
    /** Maps each active routeId to the matchId of its child in the match tree. */
    childMatchIdByRouteId: RouterReadableStore<Record<string, string>>
    /** Maps each pending routeId to true for quick lookup. */
    pendingRouteIds: RouterReadableStore<Record<string, boolean>>
  }
}

function initRouterStores(
  stores: RouterStores<AnyRoute>,
  createReadonlyStore: <TValue>(read: () => TValue) => RouterReadableStore<TValue>
) {
  stores.childMatchIdByRouteId = createReadonlyStore(() => {
    const ids = stores.matchesId.get()
    const obj: Record<string, string> = {}
    for (let i = 0; i < ids.length - 1; i++) {
      // biome-ignore lint/style/noNonNullAssertion: safe
      const parentStore = stores.matchStores.get(ids[i]!)
      if (parentStore?.routeId) {
        // biome-ignore lint/style/noNonNullAssertion: safe
        obj[parentStore.routeId] = ids[i + 1]!
      }
    }
    return obj
  })

  stores.pendingRouteIds = createReadonlyStore(() => {
    const ids = stores.pendingIds.get()
    const obj: Record<string, boolean> = {}
    for (const id of ids) {
      const store = stores.pendingMatchStores.get(id)
      if (store?.routeId) {
        obj[store.routeId] = true
      }
    }
    return obj
  })
}

function createSvelteMutableStore<TValue>(initialValue: TValue): RouterWritableStore<TValue> {
  let state = $state(initialValue)

  return {
    get: () => state,
    set: value => {
      if (typeof value !== "function") {
        state = value
      } else {
        state = (value as (prev: TValue) => TValue)(state)
      }
    }
  }
}

function createSvelteReadonlyStore<TValue>(read: () => TValue): RouterReadableStore<TValue> {
  const derived = $derived.by(read)
  return { get: () => derived }
}

export const getStoreFactory: GetStoreConfig = opts => {
  if (isServer && opts.isServer) {
    return {
      createMutableStore: createNonReactiveMutableStore,
      createReadonlyStore: createNonReactiveReadonlyStore,
      batch: fn => fn(),
      init: stores => initRouterStores(stores, createNonReactiveReadonlyStore)
    }
  }

  return {
    createMutableStore: createSvelteMutableStore,
    createReadonlyStore: createSvelteReadonlyStore,
    batch: fn => fn(),
    init: stores => initRouterStores(stores, createSvelteReadonlyStore)
  }
}
