<script>
  import Router, { link } from 'svelte-spa-router'
  import { setClient } from 'svelte-apollo'

  import initGraphQLClient from '@vf-ui/graphql-client-holochain'
  import routes from './router-config.js'

  import { AgentProfileCheck } from '@vf-ui/core-components'
  import { AgentProfileManage } from '@vf-ui/core-components'

  // init and manage GraphQL client connection
  let client = null
  let loading = true
  let error = null

  async function initConnection() {
    try {
      client = await initGraphQLClient()
    } catch (e) {
      error = e
    }
    loading = false
    error = null
  }

  initConnection()

  // :SHONK: workaround to set the context outside of init action
  $: {
    if (client) {
      setClient(client)
    }
  }
</script>

<main>
  {#if loading}
    <h1>Loading...</h1>
  {:else if error}
    <h1>Cannot connect to Holochain</h1>
    <p>{error.message}</p>
  {:else}
    <ul>
      <li><a use:link href="/offers/new">New listing</a></li>
      <li><a use:link href="/">View all</a></li>
      <li><a use:link href="/offers">Offers</a></li>
      <li><a use:link href="/requests">Requests</a></li>
    </ul>
    <Router {routes} />
  {/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
