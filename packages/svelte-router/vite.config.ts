import { svelte } from "@sveltejs/vite-plugin-svelte"
import { tanstackViteConfig } from "@tanstack/vite-config"
import { defineConfig, mergeConfig } from "vite"
import packageJson from "./package.json"

const config = defineConfig(({ mode }) => {
  if (mode === "server") {
    return {
      plugins: [svelte()],
      test: {
        name: `${packageJson.name} (server)`,
        dir: "./tests/server",
        watch: false,
        environment: "node",
        typecheck: { enabled: true },
        server: {
          deps: {
            inline: [/svelte/, /@tanstack\/svelte-store/]
          }
        }
      }
    }
  }

  return {
    plugins: [svelte()],
    // Add 'development' condition for tests to resolve @tanstack/router-core/isServer
    // to the development export (isServer = undefined) instead of node (isServer = true)
    ...(process.env.VITEST && {
      resolve: {
        conditions: ["development"]
      }
    }),
    test: {
      name: packageJson.name,
      dir: "./tests",
      exclude: ["server"],
      watch: false,
      environment: "jsdom",
      typecheck: { enabled: true },
      setupFiles: ["./tests/setupTests.ts"],
      server: {
        deps: {
          inline: [/svelte/, /tanstack-svelte-store/]
        }
      }
    }
  }
})

export default defineConfig(env =>
  mergeConfig(
    config(env),
    tanstackViteConfig({
      tsconfigPath: "./tsconfig.build.json",
      entry: ["./src/index.ts", "./src/index.dev.ts", "./src/ssr/client.ts", "./src/ssr/server.ts"],
      srcDir: "./src"
    })
  )
)
