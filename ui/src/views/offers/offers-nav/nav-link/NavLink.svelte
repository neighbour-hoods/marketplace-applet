<script>
  import { link, location } from 'svelte-spa-router'

  export let href
  export let label
</script>

<li class={$location == href ? "active" : ''}>
  <a href={href} use:link>{label}</a>
</li>

<style type="text/css">
  li.active a {
    color: #909;
  }
</style>
