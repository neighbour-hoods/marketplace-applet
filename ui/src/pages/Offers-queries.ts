import gql from 'graphql-tag'

import { OfferIntentFields } from '@valueflows/vf-marketplace-graphql-fragments/offers.fragments'

export const readOpenOffers = gql`
  ${OfferIntentFields}
  query {
    intents {
      edges {
        node {
          ...OfferIntentFields
        }
      }
    }
  }
`
