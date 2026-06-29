import type { AnyRouter, RegisteredRouter } from "@tanstack/router-core"
import { getRouterContext } from "./routerContext"

export function useRouter<TRouter extends AnyRouter = RegisteredRouter>(opts?: { warn?: boolean }): TRouter {
  const value = getRouterContext()
  if (process.env.NODE_ENV !== "production") {
    if ((opts?.warn ?? true) && !value) {
      console.warn("Warning: useRouter must be used inside a <RouterProvider> component!")
    }
  }
  return value as TRouter
}
