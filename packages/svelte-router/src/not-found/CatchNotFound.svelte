<script lang="ts">
  import type { NotFoundError } from "@tanstack/router-core"
  import type { Snippet } from "svelte"
  import { CatchBoundary } from "../CatchBoundary"
  import { useRouter } from "../useRouter"
  import { getNotFound } from "./index"

  let {
    fallback,
    onCatch,
    children
  }: { fallback?: Snippet<[NotFoundError]>; onCatch?: (error: NotFoundError) => void; children: Snippet } = $props()

  const router = useRouter()
  // TODO: Some way for the user to programmatically reset the not-found boundary?
  const pathname = $derived(router.stores.location.get().pathname)
  const status = $derived(router.stores.status.get())
</script>

<CatchBoundary
  resetKey="not-found-{pathname}-{status}"
  onCatch={error => {
    const notFoundError = getNotFound(error)

    if (notFoundError) {
      onCatch?.(notFoundError)
    } else {
      throw error
    }
  }}
  errorComponent={fallback}
>
  {@render children()}
</CatchBoundary>
