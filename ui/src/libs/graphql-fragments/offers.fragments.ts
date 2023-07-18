import gql from 'graphql-tag'

export const OfferProposalFields = gql`
  fragment OfferProposalFields on Proposal {
    id
    name
    note
    created
    hasBeginning
    hasEnd
    unitBased
  }
`
export const OfferIntentFields = gql`
  fragment OfferIntentFields on Intent {
    id
    name
    note
    action
    inputOf
    outputOf
    provider
    receiver
    resourceClassifiedAs
    resourceConformsTo {
      id
      name
      note
      image
    }
  }
`
