import { svelte } from "@sveltejs/vite-plugin-svelte"
import { tanstackViteConfig } from "@tanstack/vite-config"
import { sveltePreprocess } from "svelte-preprocess"
import { defineConfig, mergeConfig } from "vitest/config"
import packageJson from "./package.json"

const config = defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess()
    })
  ],
  test: {
    name: packageJson.name,
    watch: false,
    environment: "jsdom"
  }
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    tsconfigPath: "./tsconfig.build.json",
    srcDir: "./src",
    entry: "./src/index.ts",
    cjs: false
  })
)
