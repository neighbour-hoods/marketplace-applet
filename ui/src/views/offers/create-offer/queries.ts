import gql from 'graphql-tag'

import { OfferProposalFields } from '@valueflows/vf-marketplace-graphql-fragments/offers.fragments'

// :TODO: reuse query fragments

export const createProposal = gql`
  ${OfferProposalFields}
  mutation($proposal: ProposalCreateParams) {
    createProposal(proposal: $proposal) {
      proposal {
        ...OfferProposalFields
      }
    }
  }
`

export const createProposedIntent = gql`
mutation($proposal: ID!, $intent: ID!, $reciprocal: Boolean) {
  proposeIntent(publishedIn: $proposal, publishes: $intent, reciprocal: $reciprocal) {
    proposedIntent {
      id
      publishedIn
      publishes
      reciprocal
    }
  }
}`

export const createProposedTo = gql`
mutation($proposal: ID!, $agent: ID!) {
  proposeTo(proposed: $proposal, proposedTo: $agent) {
    proposedTo {
      id
      proposed
      proposedTo
    }
  }
}`
