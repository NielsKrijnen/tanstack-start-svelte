<script lang="ts">
  let { resetKey, reset }: { resetKey: string | number; reset: () => void } = $props()

  $effect(() => {
    resetKey
    reset()
  })
</script>
