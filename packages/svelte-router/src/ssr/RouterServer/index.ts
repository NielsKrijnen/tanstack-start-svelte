import type { AnyRouter } from "@tanstack/router-core"
import { render } from "svelte/server"
import { RouterProvider } from "../../RouterProvider"

export async function renderRouterToHtml(router: AnyRouter): Promise<string> {
  await router.load()

  const { body, head } = render(RouterProvider, {
    props: { router }
  })

  // noinspection HtmlRequiredLangAttribute
  return `
    <!DOCTYPE html>
    <html>
      <head>${head}</head>
      <body>
        <div id="app">${body}</div>
        <script type="module" src="/src/entry-client.ts"></script>
      </body>
    </html>
  `
}