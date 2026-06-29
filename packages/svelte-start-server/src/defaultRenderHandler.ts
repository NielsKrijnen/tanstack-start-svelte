import { defineHandlerCallback } from "@tanstack/start-server-core"
import { renderRouterToString } from "tanstack-svelte-router/ssr/server"
import StartServer from "./StartServer.svelte"

export const defaultRenderHandler = defineHandlerCallback(({ router, responseHeaders }) =>
  renderRouterToString({
    router,
    responseHeaders,
    children: StartServer
  })
)
