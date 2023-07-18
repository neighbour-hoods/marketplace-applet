<script>
  import Router from 'routve'
  import { getClient, query } from 'svelte-apollo'
  import { readOpenOffers } from './Offers-queries.ts'

  import OffersNav from '@vf-ui/offers-nav'

  const client = getClient()
  // const offers = query(client, { query: readOpenOffers })
</script>

<section>
  <OffersNav />

  <Router basePath="/offers" />

  <div class="timeline">
    todo
  </div>
</section>
