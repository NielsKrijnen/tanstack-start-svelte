import type {
  AnyRouter,
  DeepPartial,
  Expand,
  MakeOptionalPathParams,
  MakeOptionalSearchParams,
  MakeRouteMatchUnion,
  MaskOptions,
  MatchRouteOptions,
  RegisteredRouter,
  ResolveRoute,
  ToSubOptionsProps
} from "@tanstack/router-core"
import type { Snippet } from "svelte"
import type { SvelteHTMLElements } from "svelte/elements"

export { useChildMatches, useMatches, useMatchRoute, useParentMatches } from "./functions.svelte"
export { default as Matches } from "./Matches.svelte"
export { default as MatchRoute } from "./MatchRoute.svelte"

declare module "@tanstack/router-core" {
  export interface RouteMatchExtensions {
    meta?: Array<SvelteHTMLElements["meta"] | undefined>
    links?: Array<SvelteHTMLElements["link"] | undefined>
    scripts?: Array<SvelteHTMLElements["script"] | undefined>
    styles?: Array<SvelteHTMLElements["style"] | undefined>
    headScripts?: Array<SvelteHTMLElements["script"] | undefined>
  }
}

export type UseMatchRouteOptions<
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string | undefined = undefined,
  TMaskFrom extends string = TFrom,
  TMaskTo extends string = ""
> = ToSubOptionsProps<TRouter, TFrom, TTo> &
  DeepPartial<MakeOptionalSearchParams<TRouter, TFrom, TTo>> &
  DeepPartial<MakeOptionalPathParams<TRouter, TFrom, TTo>> &
  MaskOptions<TRouter, TMaskFrom, TMaskTo> &
  MatchRouteOptions

export type MakeMatchRouteOptions<
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string | undefined = undefined,
  TMaskFrom extends string = TFrom,
  TMaskTo extends string = ""
> = UseMatchRouteOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & {
  children: Snippet<[Expand<ResolveRoute<TRouter, TFrom, TTo>["types"]["allParams"]>]>
}

export interface UseMatchesBaseOptions<TRouter extends AnyRouter, TSelected> {
  select?: (matches: Array<MakeRouteMatchUnion<TRouter>>) => TSelected
}

export type UseMatchesResult<TRouter extends AnyRouter, TSelected> = unknown extends TSelected
  ? Array<MakeRouteMatchUnion<TRouter>>
  : TSelected
