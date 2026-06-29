<script lang="ts">
  // biome-ignore lint/suspicious/noExplicitAny: safe
  let { error }: { error: any } = $props()

  let show = $state(process.env.NODE_ENV !== "production")
</script>

<div style="padding: .5rem; max-width: 100%">
  <div style="display: flex; align-items: center; gap: .5rem">
    <strong style="font-size: 1rem">Something went wrong!</strong>
    <button
      type="reset"
      aria-label="Toggle Error"
      style="appearance: none; font-size: .6em; border: 1px solid currentColor; padding: .1rem .2rem; font-weight: bold; border-radius: .25rem"
      onclick={() => show = !show}
    >
      {#if show}
        Hide Error
      {:else}
        Show Error
      {/if}
    </button>
  </div>
  <div style="height: .25rem"></div>
  {#if show}
    <div>
      <pre
        style="font-size: .7em; border: 1px solid red; border-radius: .25rem; padding: .3rem; color: red; overflow: auto"
      >{#if error.message}
          <code>{error.message}</code>
        {/if}</pre>
    </div>
  {/if}
</div>
