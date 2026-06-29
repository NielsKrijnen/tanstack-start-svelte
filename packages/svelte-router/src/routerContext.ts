import type { AnyRouter } from "@tanstack/router-core"
import { createContext } from "svelte"

export const [getRouterContext, setRouterContext] = createContext<AnyRouter>()
