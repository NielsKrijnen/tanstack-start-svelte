import type { Snippet } from "svelte"

export interface ClientOnlyProps {
  /**
   * The children to render when the JS is loaded.
   */
  children: Snippet
  /**
   * The fallback component to render if the JS is not yet loaded.
   */
  fallback?: Snippet
}

export { default as ClientOnly } from "./ClientOnly.svelte"

let globalHydrated = false

/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 *
 * @example
 * ```svelte
 * <!-- Disable a button that needs JS to work. -->
 * <script>
 *   const hydrated = useHydrated()
 * </script>
 *
 * <button type="button" disabled={!hydrated()} onclick={doSomethingCustom}>
 *   Click me
 * </button>
 * ```
 * @returns True if the JS has been hydrated already, false otherwise.
 */
export function useHydrated() {
  let hydrated = $state(globalHydrated)

  $effect(() => {
    globalHydrated = true
    hydrated = true
  })

  return () => hydrated
}
