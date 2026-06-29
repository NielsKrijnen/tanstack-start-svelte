import type { AnyRouter, RegisteredRouter, RouterOptions } from "@tanstack/router-core"

export { default as RouterContextProvider } from "./RouterContextProvider.svelte"
export { default as RouterProvider } from "./RouterProvider.svelte"

export type RouterProps<
  TRouter extends AnyRouter = RegisteredRouter,
  // biome-ignore lint/suspicious/noExplicitAny: safe
  TDehydrated extends Record<string, any> = Record<string, any>
> = Omit<
  RouterOptions<
    TRouter["routeTree"],
    NonNullable<TRouter["options"]["trailingSlash"]>,
    false,
    TRouter["history"],
    TDehydrated
  >,
  "context"
> & {
  router: TRouter
  context?: Partial<
    RouterOptions<
      TRouter["routeTree"],
      NonNullable<TRouter["options"]["trailingSlash"]>,
      false,
      TRouter["history"],
      TDehydrated
    >["context"]
  >
}
