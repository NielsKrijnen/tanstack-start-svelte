<script lang="ts">
  import { type AnyRoute, rootRouteId } from "@tanstack/router-core"
  import { isServer } from "@tanstack/router-core/isServer"
  import { useRouter } from "../useRouter"
  import ResolvedSuspense from "./ResolvedSuspense.svelte"
  import MatchesInner from "./MatchesInner.svelte"

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
    <ResolvedSuspense>
      {#snippet fallback()}
        {@const PendingComponent = rootRoute().options.pendingComponent ?? router.options.defaultPendingComponent}
        {#if PendingComponent}
          <PendingComponent />
        {/if}
      {/snippet}
      {@render Content()}
    </ResolvedSuspense>
  {/if}
{/snippet}

{#if router.options.InnerWrap}
  {@const InnerWrap = router.options.InnerWrap}
  <InnerWrap children={InnerWrapContent} />
{:else}
  {@render InnerWrapContent()}
{/if}
