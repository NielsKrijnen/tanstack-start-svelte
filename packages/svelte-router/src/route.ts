import {
  type AnyContext,
  type AnyRoute,
  type AnyRouter,
  BaseRootRoute,
  BaseRoute,
  BaseRouteApi,
  type ConstrainLiteral,
  type ErrorComponentProps,
  type NotFoundError,
  type NotFoundRouteProps,
  type Register,
  type RegisteredRouter,
  type ResolveFullPath,
  type ResolveId,
  type ResolveParams,
  type RootRoute as RootRouteCore,
  type RootRouteId,
  type RootRouteOptions,
  type RouteConstraints,
  type Route as RouteCore,
  type RouteIds,
  type RouteMask,
  type RouteOptions,
  type RouterCore,
  type RouteTypesById,
  type ToMaskOptions,
  type UseNavigateResult
} from "@tanstack/router-core"
import type { Component, Snippet } from "svelte"
import { type UseMatchRoute, useMatch } from "./useMatch.svelte"
import { useRouter } from "./useRouter"

declare module "@tanstack/router-core" {
  export interface UpdatableRouteOptionsExtensions {
    component?: RouteComponent
    errorComponent?: false | null | undefined | ErrorRouteComponent
    notFoundComponent?: NotFoundRouteComponent
    pendingComponent?: RouteComponent
  }

  export interface RootRouteOptionsExtensions {
    shellComponent?: Component<{ children: Snippet }>
  }

  export interface RouteExtensions<in out TId extends string, in out TFullPath extends string> {
    useMatch: UseMatchRoute<TId>
    useRouteContext: UseRouteContextRoute<TId>
    useSearch: UseSearchRoute<TId>
    useParams: UseParamsRoute<TId>
    useLoaderDeps: UseLoaderDepsRoute<TId>
    useLoaderData: UseLoaderDataRoute<TId>
    useNavigate: () => UseNavigateResult<TFullPath>
  }
}

export function getRouteApi<const TId, TRouter extends AnyRouter = RegisteredRouter>(
  id: ConstrainLiteral<TId, RouteIds<TRouter["routeTree"]>>
) {
  return new RouteApi<TId, TRouter>({ id })
}

export class RouteApi<const TId, TRouter extends AnyRouter = RegisteredRouter> extends BaseRouteApi<TId, TRouter> {
  /**
   * @deprecated Use the `getRouteApi` function instead.
   */
  constructor({ id }: { id: TId }) {
    super({ id })
  }

  useMatch: UseMatchRoute<TId> = opts => {
    return useMatch({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useRouteContext: UseRouteContextRoute<TId> = opts => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useRouteContext({ ...(opts as any), from: this.id })
  }

  useSearch: UseSearchRoute<TId> = opts => {
    return useSearch({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useParams: UseParamsRoute<TId> = opts => {
    return useParams({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useLoaderDeps: UseLoaderDepsRoute<TId> = opts => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useLoaderDeps({ ...opts, from: this.id, strict: false } as any)
  }

  useLoaderData: UseLoaderDataRoute<TId> = opts => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useLoaderData({ ...opts, from: this.id, strict: false } as any)
  }

  useNavigate = (): UseNavigateResult<RouteTypesById<TRouter, TId>["fullPath"]> => {
    const router = useRouter()
    return useNavigate({ from: router.routesById[this.id as string].fullPath })
  }

  notFound = (opts?: NotFoundError) => {
    return notFound({ routeId: this.id as string, ...opts })
  }
}

export class Route<
    in out TRegister = unknown,
    in out TParentRoute extends RouteConstraints["TParentRoute"] = AnyRoute,
    in out TPath extends RouteConstraints["TPath"] = "/",
    in out TFullPath extends RouteConstraints["TFullPath"] = ResolveFullPath<TParentRoute, TPath>,
    in out TCustomId extends RouteConstraints["TCustomId"] = string,
    in out TId extends RouteConstraints["TId"] = ResolveId<TParentRoute, TCustomId, TPath>,
    in out TSearchValidator = undefined,
    in out TParams = ResolveParams<TPath>,
    in out TRouterContext = AnyContext,
    in out TRouteContextFn = AnyContext,
    in out TBeforeLoadFn = AnyContext,
    // biome-ignore lint/suspicious/noExplicitAny: safe
    // biome-ignore lint/complexity/noBannedTypes: safe
    in out TLoaderDeps extends Record<string, any> = {},
    in out TLoaderFn = undefined,
    in out TChildren = unknown,
    in out TFileRouteTypes = unknown,
    in out TSSR = unknown,
    in out TMiddlewares = unknown,
    in out THandlers = undefined
  >
  extends BaseRoute<
    TRegister,
    TParentRoute,
    TPath,
    TFullPath,
    TCustomId,
    TId,
    TSearchValidator,
    TParams,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderFn,
    TChildren,
    TFileRouteTypes,
    TSSR,
    TMiddlewares,
    THandlers
  >
  implements
    RouteCore<
      TRegister,
      TParentRoute,
      TPath,
      TFullPath,
      TCustomId,
      TId,
      TSearchValidator,
      TParams,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TLoaderFn,
      TChildren,
      TFileRouteTypes,
      TSSR,
      TMiddlewares,
      THandlers
    >
{
  /**
   * @deprecated Use the `createRoute` function instead.
   */
  // biome-ignore lint/complexity/noUselessConstructor: safe
  constructor(
    options?: RouteOptions<
      TRegister,
      TParentRoute,
      TId,
      TCustomId,
      TFullPath,
      TPath,
      TSearchValidator,
      TParams,
      TLoaderDeps,
      TLoaderFn,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TSSR,
      TMiddlewares,
      THandlers
    >
  ) {
    super(options)
  }

  useMatch: UseMatchRoute<TId> = opts => {
    return useMatch({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useRouteContext: UseRouteContextRoute<TId> = (opts?) => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useRouteContext({ ...(opts as any), from: this.id }) as any
  }

  useSearch: UseSearchRoute<TId> = opts => {
    return useSearch({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useParams: UseParamsRoute<TId> = opts => {
    return useParams({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useLoaderDeps: UseLoaderDepsRoute<TId> = opts => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useLoaderDeps({ ...opts, from: this.id } as any)
  }

  useLoaderData: UseLoaderDataRoute<TId> = opts => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useLoaderData({ ...opts, from: this.id } as any)
  }

  useNavigate = (): UseNavigateResult<TFullPath> => {
    return useNavigate({ from: this.fullPath })
  }
}

export function createRoute<
  TRegister = unknown,
  TParentRoute extends RouteConstraints["TParentRoute"] = AnyRoute,
  TPath extends RouteConstraints["TPath"] = "/",
  TFullPath extends RouteConstraints["TFullPath"] = ResolveFullPath<TParentRoute, TPath>,
  TCustomId extends RouteConstraints["TCustomId"] = string,
  TId extends RouteConstraints["TId"] = ResolveId<TParentRoute, TCustomId, TPath>,
  TSearchValidator = undefined,
  TParams = ResolveParams<TPath>,
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
  // biome-ignore lint/suspicious/noExplicitAny: safe
  // biome-ignore lint/complexity/noBannedTypes: safe
  TLoaderDeps extends Record<string, any> = {},
  TLoaderFn = undefined,
  TChildren = unknown,
  TSSR = unknown,
  THandlers = undefined
>(
  options: RouteOptions<
    TRegister,
    TParentRoute,
    TId,
    TCustomId,
    TFullPath,
    TPath,
    TSearchValidator,
    TParams,
    TLoaderDeps,
    TLoaderFn,
    AnyContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TSSR,
    THandlers
  >
): Route<
  TRegister,
  TParentRoute,
  TPath,
  TFullPath,
  TCustomId,
  TId,
  TSearchValidator,
  TParams,
  AnyContext,
  TRouteContextFn,
  TBeforeLoadFn,
  TLoaderDeps,
  TLoaderFn,
  TChildren,
  unknown,
  TSSR,
  THandlers
> {
  return new Route<
    TRegister,
    TParentRoute,
    TPath,
    TFullPath,
    TCustomId,
    TId,
    TSearchValidator,
    TParams,
    AnyContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderFn,
    TChildren,
    unknown,
    TSSR,
    THandlers
  >(options)
}

export function createRootRouteWithContext<TRouterContext extends {}>() {
  return <
    TRegister = Register,
    TRouteContextFn = AnyContext,
    TBeforeLoadFn = AnyContext,
    TSearchValidator = undefined,
    // biome-ignore lint/suspicious/noExplicitAny: safe
    // biome-ignore lint/complexity/noBannedTypes: safe
    TLoaderDeps extends Record<string, any> = {},
    TLoaderFn = undefined,
    TSSR = unknown,
    THandlers = undefined
  >(
    options?: RootRouteOptions<
      TRegister,
      TSearchValidator,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TLoaderFn,
      TSSR,
      THandlers
    >
  ) => {
    return createRootRoute<
      TRegister,
      TSearchValidator,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TLoaderFn,
      TSSR,
      THandlers
    >(options)
  }
}

/**
 * @deprecated Use the `createRootRouteWithContext` function instead.
 */
export const rootRouteWithContext = createRootRouteWithContext

export class RootRoute<
    in out TRegister = Register,
    in out TSearchValidator = undefined,
    // biome-ignore lint/complexity/noBannedTypes: safe
    in out TRouterContext = {},
    in out TRouteContextFn = AnyContext,
    in out TBeforeLoadFn = AnyContext,
    // biome-ignore lint/suspicious/noExplicitAny: safe
    // biome-ignore lint/complexity/noBannedTypes: safe
    in out TLoaderDeps extends Record<string, any> = {},
    in out TLoaderFn = undefined,
    in out TChildren = unknown,
    in out TFileRouteTypes = unknown,
    in out TSSR = unknown,
    in out THandlers = undefined
  >
  extends BaseRootRoute<
    TRegister,
    TSearchValidator,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderFn,
    TChildren,
    TFileRouteTypes,
    TSSR,
    THandlers
  >
  implements
    RootRouteCore<
      TRegister,
      TSearchValidator,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TLoaderFn,
      TChildren,
      TFileRouteTypes,
      TSSR,
      THandlers
    >
{
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(
    options?: RootRouteOptions<
      TRegister,
      TSearchValidator,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TLoaderFn,
      TSSR,
      THandlers
    >
  ) {
    super(options)
  }

  useMatch: UseMatchRoute<RootRouteId> = opts => {
    return useMatch({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useRouteContext: UseRouteContextRoute<RootRouteId> = opts => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useRouteContext({ ...(opts as any), from: this.id })
  }

  useSearch: UseSearchRoute<RootRouteId> = opts => {
    return useSearch({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useParams: UseParamsRoute<RootRouteId> = opts => {
    return useParams({
      select: opts?.select,
      from: this.id
      // biome-ignore lint/suspicious/noExplicitAny: safe
    } as any) as any
  }

  useLoaderDeps: UseLoaderDepsRoute<RootRouteId> = opts => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useLoaderDeps({ ...opts, from: this.id } as any)
  }

  useLoaderData: UseLoaderDataRoute<RootRouteId> = opts => {
    // biome-ignore lint/suspicious/noExplicitAny: safe
    return useLoaderData({ ...opts, from: this.id } as any)
  }

  useNavigate = (): UseNavigateResult<"/"> => {
    return useNavigate({ from: this.fullPath })
  }
}

export function createRouteMask<TRouteTree extends AnyRoute, TFrom extends string, TTo extends string>(
  opts: {
    routeTree: TRouteTree
  } & ToMaskOptions<RouterCore<TRouteTree, "never", false>, TFrom, TTo>
): RouteMask<TRouteTree> {
  // biome-ignore lint/suspicious/noExplicitAny: safe
  return opts as any
}

// biome-ignore lint/suspicious/noExplicitAny: safe
export type AnyRootRoute = RootRoute<any, any, any, any, any, any, any, any, any, any>

// biome-ignore lint/suspicious/noExplicitAny: safe
export interface DefaultRouteTypes<TProps extends Record<string, any>> {
  component: Component<TProps>
}
// biome-ignore lint/suspicious/noExplicitAny: safe
export interface RouteTypes<TProps extends Record<string, any>> extends DefaultRouteTypes<TProps> {}

// biome-ignore lint/suspicious/noExplicitAny: safe
export type AsyncRouteComponent<TProps extends Record<string, any>> = RouteTypes<TProps>["component"] & {
  preload?: () => Promise<void>
}

// biome-ignore lint/complexity/noBannedTypes: safe
export type RouteComponent = AsyncRouteComponent<{}>

export type ErrorRouteComponent = AsyncRouteComponent<ErrorComponentProps>

export type NotFoundRouteComponent = RouteTypes<NotFoundRouteProps>["component"]

export class NotFoundRoute<
  TRegister,
  TParentRoute extends AnyRootRoute,
  TRouterContext = AnyContext,
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
  TSearchValidator = undefined,
  // biome-ignore lint/suspicious/noExplicitAny: safe
  // biome-ignore lint/complexity/noBannedTypes: safe
  TLoaderDeps extends Record<string, any> = {},
  TLoaderFn = undefined,
  TChildren = unknown,
  TSSR = unknown,
  THandlers = undefined
> extends Route<
  TRegister,
  TParentRoute,
  "/404",
  "/404",
  "404",
  "404",
  TSearchValidator,
  // biome-ignore lint/complexity/noBannedTypes: safe
  {},
  TRouterContext,
  TRouteContextFn,
  TBeforeLoadFn,
  TLoaderDeps,
  TLoaderFn,
  TChildren,
  TSSR,
  THandlers
> {
  constructor(
    options: Omit<
      RouteOptions<
        TRegister,
        TParentRoute,
        string,
        string,
        string,
        string,
        TSearchValidator,
        // biome-ignore lint/complexity/noBannedTypes: safe
        {},
        TLoaderDeps,
        TLoaderFn,
        TRouterContext,
        TRouteContextFn,
        TBeforeLoadFn,
        TSSR,
        THandlers
      >,
      "caseSensitive" | "parseParams" | "stringifyParams" | "path" | "id" | "params"
    >
  ) {
    super({
      // biome-ignore lint/suspicious/noExplicitAny: safe
      ...(options as any),
      id: "404"
    })
  }
}

export function createRootRoute<
  TRegister = Register,
  TSearchValidator = undefined,
  // biome-ignore lint/complexity/noBannedTypes: safe
  TRouterContext = {},
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
  // biome-ignore lint/suspicious/noExplicitAny: safe
  // biome-ignore lint/complexity/noBannedTypes: safe
  TLoaderDeps extends Record<string, any> = {},
  TLoaderFn = undefined,
  TSSR = unknown,
  THandlers = undefined
>(
  options?: RootRouteOptions<
    TRegister,
    TSearchValidator,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderFn,
    TSSR,
    THandlers
  >
): RootRoute<
  TRegister,
  TSearchValidator,
  TRouterContext,
  TRouteContextFn,
  TBeforeLoadFn,
  TLoaderDeps,
  TLoaderFn,
  unknown,
  unknown,
  TSSR,
  THandlers
> {
  return new RootRoute<
    TRegister,
    TSearchValidator,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderFn,
    unknown,
    unknown,
    TSSR,
    THandlers
  >(options)
}
