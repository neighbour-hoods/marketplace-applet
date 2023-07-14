<script>
  export let form
  export let check = ''
</script>

{#if $form.hasError(check)}
<span class="error" aria-live="polite">
  <slot></slot>
</span>
{/if}

<style>
.error {
  color: #D00;
  background: #FEE;
  padding: 0.3em 0.5em;
}
</style>
