<script lang="ts">
/**
 * Form control for adding a "directed" intent, where the `contextAgent`
 * is either the `provider` or `receiver` of the intent being cast.
 *
 * @package  ValueFlows UI
 * @since    2020-08-12
 */
import { createEventDispatcher, onMount, onDestroy } from 'svelte'
import { format } from 'fecha'

import addPersistence from '@vf-ui/persist-svelte-store'
import { ACTION_IDS_MARKETPLACE } from '@vf-ui/core'
import { buildFormSpec, buildSubmitHandler } from './schemas'
import type { IntentFormType } from './schemas'

import DateInput from '@vf-ui/form-input-date'
import MeasureInput from '@vf-ui/form-input-measure'
import FieldError from '@vf-ui/form-field-error'

const SHORT_ISODATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

// -- PROPS --

export let contextAgent: string // ID of agent submitting the Intent
export let contextAgentType: IntentFormType = 'provider' // or 'receiver'
export let formTitle: string
export let temporalFormTitle: string

// set to a string to persist the form state within the given key
export let persistState: string | false = false

// form labels (:TODO: put into i18n framework)
// action labels are configurable since they depend on the context agent type...
export let ACTION_FORM_LABELS = {
  transfer: 'Transfer a resource',
  'transfer-custody': 'Lend a resource',
  work: 'Do some work',
  'deliver-service': 'Provide a specialised service',
}
// ...as for dates, you may just want to change them.
export let DATE_SELECTION_LABELS = {
  none: 'Any time',
  single: 'At precisely',
  before: 'Before',
  range: 'Between',
  after: 'Any time after',
}
const DATE_INPUT_TYPES = Object.keys(DATE_SELECTION_LABELS)

// -- INTERNAL STATE --

let selectedTimeRange: [Date?, Date?] = []

// -- EVENT HANDLERS --

const dispatch = createEventDispatcher()
const onSubmit = buildSubmitHandler(contextAgentType, dispatch)

// -- FORM STATE --


// -- INIT LOGIC --

const {
  form: formData,
  senderId, action, name, note,
  resourceConformsTo, resourceQuantity, effortQuantity,
  hasBeginning, hasEnd, hasPointInTime, due,
  dateMode,
} = buildFormSpec(contextAgentType)
const formCtx = persistState ? addPersistence(persistState, formData) : formData

onMount(async () => {
  // Also trigger an event to propagate the form state data to parent controls.
  // The on:initForm API is needed instead of bind:validate when parent controls
  // dynamically update the presence of child components (bindings appear to only fire once)
  dispatch('initForm', formCtx)
})
onDestroy(async () => {
  // trigger a destroy event too, to allow parent controls to unbind any validation logic
  dispatch('unloadForm', formCtx)
})

function reset () {
  formCtx.reset()
}

// reactive handlers to publish local state back into the form validator
$senderId = contextAgent
$: {
  if (selectedTimeRange && selectedTimeRange.length === 2) {
    $hasBeginning = format(selectedTimeRange[0], SHORT_ISODATETIME_FORMAT)
    $hasEnd = format(selectedTimeRange[1], SHORT_ISODATETIME_FORMAT)
  }
}
</script>

<form on:submit={onSubmit}>
  <h3>{formTitle}</h3>

  <p>
    {#each ACTION_IDS_MARKETPLACE as actionId}
    <label>
      <input type=radio bind:group={$action.value} value={actionId} />
      {ACTION_FORM_LABELS[actionId]}
    </label>
    {/each}
    <FieldError form={formCtx} check="action.required">Please specify your intention.</FieldError>
  </p>

  <p>
    <!-- :TODO: resource autocomplete -->
    <input type="text" bind:value={$resourceConformsTo.value} />
  </p>

  {#if $action.value === 'transfer' || $action.value === 'transfer-custody'}
    <h3>How many?</h3>
  {:else}
    <h3>For how long?</h3>
    <!-- :TODO: should "deliver-service" give the option for time-based & unitless measures? What about other unit types? -->
  {/if}
  <p>
    <MeasureInput bind:normalizedValue={$resourceQuantity.value} />
    <small>(leave blank if you don't know yet)</small>
  </p>

  {#if $action.value === 'transfer-custody'}
    <h3>For how long?</h3>
    <p>
      <MeasureInput bind:normalizedValue={$effortQuantity.value} />
      <small>(Leave blank for no limit)</small>
    </p>
  {/if}

  <h3>{temporalFormTitle}</h3>

  <p>
    {#each DATE_INPUT_TYPES as mode}
    <label>
      <input type=radio bind:group={$dateMode.value} value={mode} />
      {DATE_SELECTION_LABELS[mode]}
    </label>
    {/each}
    <FieldError form={formCtx} check="dateMode.required">Please specify when you'd like things to happen.</FieldError>
  </p>

  {#if $dateMode.value !== 'none'}
  <p>
    {#if $dateMode.value === 'single'}
      <DateInput bind:value={$hasPointInTime.value} />
      <FieldError form={formCtx} check="hasPointInTime.required">This field is required.</FieldError>
    {:else if $dateMode.value === 'after'}
      <DateInput bind:value={$hasBeginning.value} />
      <FieldError form={formCtx} check="hasBeginning.required">This field is required.</FieldError>
    {:else if $dateMode.value === 'before'}
      <DateInput bind:value={$hasEnd.value} />
      <FieldError form={formCtx} check="hasEnd.required">This field is required.</FieldError>
    {:else if $dateMode.value === 'range'}
      <DateInput bind:value={selectedTimeRange} selectRange={true}/>
      <FieldError form={formCtx} check="hasBeginning.required">This field is required.</FieldError>
      <FieldError form={formCtx} check="hasEnd.required">This field is required.</FieldError>
    {/if}
  </p>
  {/if}

  <!-- <p>
    <label for="name">Title</label>
    <textarea id="name" bind:value="{$name.value}" />
    <FieldError form={formCtx} check="name.required">This field is required.</FieldError>
  </p> -->

  <!-- <p>
    <label for="note">Notes</label>
    <textarea id="note" bind:value="{$note.value}" />
    <FieldError form={formCtx} check="note.required">This field is required.</FieldError>
  </p> -->

  <!-- :TODO: image -->

  <!-- :TODO: attachments -->

  <!-- :TODO: location -->

  <!-- :TODO: agreement -->
</form>

<style>
  small {
    color: #888;
    font-style: italic;
  }
</style>
