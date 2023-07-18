import gql from 'graphql-tag'

import { OfferIntentFields } from '@valueflows/vf-marketplace-graphql-fragments/offers.fragments'

export const createIntent = gql`
  ${OfferIntentFields}
  mutation($intent: IntentCreateParams) {
    createIntent(intent: $intent) {
      intent {
        ...OfferIntentFields
      }
    }
  }
`
