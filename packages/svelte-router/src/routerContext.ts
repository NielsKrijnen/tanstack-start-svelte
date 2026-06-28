// @ts-expect-error
import type { AnyRouter } from "@tanstack/router-core"
import { createContext } from "svelte"

export const routerContext = createContext<AnyRouter>()
