import gql from 'graphql-tag'

// :TODO: reuse query fragments

export const readListingTimeline = gql`{
  proposals {
    id
    revisionId
    note
    name
    hasBeginning
    hasEnd
    created
    inScopeOf
    publishes {
      id
      revisionId
      reciprocal
      publishes {
        id
        revisionId
        note
        name
        action
        provider
        receiver
        resourceClassifiedAs
        resourceConformsTo {
          id
          name
          note
        }
        resourceInventoriedAs {
          id
          name
          note
        }
        resourceQuantity {
          hasNumericalValue
          hasUnit {
            id
            label
            symbol
          }
        }
        effortQuantity {
          hasNumericalValue
          hasUnit {
            id
            label
            symbol
          }
        }
      }
    }
    publishedTo {
      id
      revisionId
      proposedTo {
        id
        revisionId
        name
        image
      }
    }
  }
}`
