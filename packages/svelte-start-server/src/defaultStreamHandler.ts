import { defineHandlerCallback } from "@tanstack/start-server-core"
import { renderRouterToStream } from "tanstack-svelte-router/ssr/server"
import StartServer from "./StartServer.svelte"

export const defaultStreamHandler = defineHandlerCallback(
  async ({ request, router, responseHeaders }) =>
    await renderRouterToStream({
      request,
      router,
      responseHeaders,
      children: StartServer
    })
)
