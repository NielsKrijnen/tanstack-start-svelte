<script lang="ts">
  import { type AnyRoute, rootRouteId } from "@tanstack/router-core"
  import { isServer } from "@tanstack/router-core/isServer"
  import { useRouter } from "../useRouter"
  import MatchesInner from "./MatchesInner.svelte"
  import Suspense from "../Suspense.svelte"

  const router = useRouter()

  const rootRoute: () => AnyRoute = () => router.routesById[rootRouteId]
</script>

{#snippet Content()}
  <Transitioner />
  <MatchesInner />
{/snippet}

{#snippet InnerWrapContent()}
  {#if (isServer ?? router.isServer) || (typeof document !== "undefined" && router.ssr)}
    {@render Content()}
  {:else}
    <Suspense>
      {#snippet fallback()}
        {@const PendingComponent = rootRoute().options.pendingComponent ?? router.options.defaultPendingComponent}
        {#if PendingComponent}
          <PendingComponent />
        {/if}
      {/snippet}
      {@render Content()}
    </Suspense>
  {/if}
{/snippet}

{#if router.options.InnerWrap}
  {@const InnerWrap = router.options.InnerWrap}
  <InnerWrap children={InnerWrapContent} />
{:else}
  {@render InnerWrapContent()}
{/if}
