/**
 * Svelte hook to wrap `IntersectionObserver`.
 *
 * This hook will create an `IntersectionObserver` and observe the ref passed to it.
 *
 * When the intersection changes, the callback will be called with the `IntersectionObserverEntry`.
 *
 * @param ref - The ref to observe
 * @param intersectionObserverOptions - The options to pass to the IntersectionObserver
 * @param options - The options to pass to the hook
 * @param callback - The callback to call when the intersection changes
 * @returns The IntersectionObserver instance
 * @example
 * ```svelte
 * <script lang="ts">
 *   let ref: HTMLDivElement | null = $state(null)
 *   useIntersectionObserver(
 *     ref,
 *     (entry) => { doSomething(entry) },
 *     { rootMargin: '10px' },
 *     { disabled: false }
 *   )
 * </script>
 *
 * <div bind:this={ref} />
 * ```
 */
export function useIntersectionObserver<T extends Element>(
  ref: T | null,
  callback: (entry: IntersectionObserverEntry | undefined) => void,
  intersectionObserverOptions: IntersectionObserverInit = {},
  options: { disabled?: boolean } = {}
): IntersectionObserver | null {
  const isIntersectionObserverAvailable = typeof IntersectionObserver === "function"
  let observerRef: IntersectionObserver | null = null

  $effect.root(() => {
    $effect(() => {
      if (!ref || !isIntersectionObserverAvailable || options.disabled) {
        return
      }

      observerRef = new IntersectionObserver(([entry]) => {
        callback(entry)
      }, intersectionObserverOptions)

      observerRef.observe(ref)

      return () => observerRef?.disconnect()
    })
  })

  return observerRef
}
