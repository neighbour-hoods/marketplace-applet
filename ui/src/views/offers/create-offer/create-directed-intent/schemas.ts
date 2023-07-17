/**
 * Yup form validation schemas for different parts of marketplace Intent logic
 *
 * @package: ValueFlows offers & needs marketplace
 * @since:   2020-08-12
 */

import { form, field, combined } from 'svelte-forms'
import type { Field } from 'svelte-forms/types'
import { get } from 'svelte/store'
import type { Readable } from 'svelte/store'
import { required, pattern } from 'svelte-forms/validators'

import { ACTION_IDS_MARKETPLACE } from '@vf-ui/core'

export type IntentFormType = 'provider' | 'receiver'

// validators

const oneOfSet = (setValues: any[], validatorName: string) => (value: string) => ({ valid: setValues.indexOf(value) !== -1, name: validatorName })
function requiredIf<T> (store: Readable<Field<T>>, vals: T[]) { return (value: string) => vals.indexOf(get(store).value) !== -1 ? required()(value) : { valid: true, name: 'required' } }

// schema / form field / reactive data defs

const measureFields = [
  field('hasNumericalValue', '1', [pattern(/\d+/)]),
  field('hasUnit', ''),
]
function measureReducer ([hasNumericalValue, hasUnit]: [string, string]) { return { hasNumericalValue, hasUnit } }

// const location = yup.object().shape({
//   name: yup.string().required(),
//   note: yup.string(),
//   mappableAddress: yup.string(),
//   lat: yup.number(),
//   lng: yup.number(),
//   alt: yup.number(),
// })

export const buildFormSpec = (ft: IntentFormType) => {
  // not part of VF spec- internal form state
  const dateMode = field('dateMode', 'none', [required(), oneOfSet(['none', 'single', 'before', 'range', 'after'], 'date_mode_ok')])

  const senderId = field(ft, '', [required()])
  const action = field('action', 'transfer', [required(), oneOfSet(ACTION_IDS_MARKETPLACE, 'action_ok')])
  const name = field('name', '')
  const note = field('note', '')
  const resourceConformsTo = field('resourceConformsTo', '')
  // @ts-ignore
  const resourceQuantity = combined('resourceQuantity', measureFields, measureReducer)
  // @ts-ignore
  const effortQuantity = combined('effortQuantity', measureFields, measureReducer)

  // :TODO: date field format validation
  const hasBeginning = field('hasBeginning', '', [requiredIf(dateMode, ['range', 'after'])])
  const hasEnd = field('hasEnd', '', [requiredIf(dateMode, ['range', 'before'])])
  const hasPointInTime = field('hasPointInTime', '', [requiredIf(dateMode, ['single'])])
  const due = field('due', '')

  // :TODO: atLocation, agreedIn, image, resourceClassifiedAs, resourceInventoriedAs, availableQuantity

  return {
    senderId,
    action,
    name,
    note,
    resourceConformsTo,
    resourceQuantity,
    effortQuantity,
    hasBeginning,
    hasEnd,
    hasPointInTime,
    due,
    dateMode,
    form: form(
      senderId, action, name, note,
      resourceConformsTo, resourceQuantity, effortQuantity,
      hasBeginning, hasEnd, hasPointInTime, due,
      dateMode,
    ),
  }
}

export const buildSubmitHandler = (ft: IntentFormType, dispatch: Function) =>
  (data, context) => {
    const derivedIntent = Object.assign({
      [ft]: data[ft],
      action: data.action,
      resourceQuantity: data.resourceQuantity,
    },
    (data.dateMode === 'single' ? {
      hasPointInTime: data.hasPointInTime,
    } : {}),
    (data.dateMode === 'range' ? {
      hasBeginning: data.hasBeginning,
      hasEnd: data.hasEnd,
    } : {}))

    dispatch('validated', derivedIntent)
  }
