/**
 * App routing configuration
 *
 * @package  Holo-REA offers & needs marketplace UI
 * @since:   2020-07-14
 */

import Timeline from './pages/Timeline.svelte'
import Offers from './pages/Offers.svelte'
import CreateOffer from './pages/CreateOffer.svelte'

export default {
  '/': Timeline,
  '/offers': Offers,
  '/offers/new': CreateOffer,
}
