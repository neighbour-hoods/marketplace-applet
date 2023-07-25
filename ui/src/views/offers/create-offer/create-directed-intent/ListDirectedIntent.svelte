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
import { createForm } from 'felte'
import { validator } from '@felte/validator-yup'
import * as yup from 'yup'

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

const { form, data, setData } = createForm({
  onSubmit,
  initialValues: {
    listingType: 'gift',
  },
  extend: validator({ schema: buildFormSpec(contextAgentType) }),
})
// :TODO: inject persistence subscriber to overarching form store if configured

// -- INIT LOGIC --

onMount(async () => {
  // Also trigger an event to propagate the form state data to parent controls.
  // The on:initForm API is needed instead of bind:validate when parent controls
  // dynamically update the presence of child components (bindings appear to only fire once)
  dispatch('initForm', form)
})
onDestroy(async () => {
  // trigger a destroy event too, to allow parent controls to unbind any validation logic
  dispatch('unloadForm', form)
})

function reset () {
  form.reset()
}

// reactive handlers to publish local state back into the form validator
$: {
  if (selectedTimeRange && selectedTimeRange.length === 2) {
    setData('hasBeginning', format(selectedTimeRange[0] as Date, SHORT_ISODATETIME_FORMAT))
    setData('hasEnd', format(selectedTimeRange[1] as Date, SHORT_ISODATETIME_FORMAT))
  }
}
</script>

<form use:form>
  <h3>{formTitle}</h3>

  <input type="hidden" name={contextAgentType} value={contextAgent} />

  <p>
    {#each ACTION_IDS_MARKETPLACE as actionId}
    <label>
      <input type=radio name="action" value={actionId} />
      {ACTION_FORM_LABELS[actionId]}
    </label>
    {/each}
    <FieldError form={form} check="action.required">Please specify your intention.</FieldError>
  </p>

  <p>
    <!-- :TODO: resource autocomplete -->
    <input type="text" name="resourceConformsTo" />
  </p>

  {#if $data.action === 'transfer' || $data.action === 'transfer-custody'}
    <h3>How many?</h3>
  {:else}
    <h3>For how long?</h3>
    <!-- :TODO: should "deliver-service" give the option for time-based & unitless measures? What about other unit types? -->
  {/if}
  <p>
    <MeasureInput bind:normalizedValue={$data.resourceQuantity} />
    <small>(leave blank if you don't know yet)</small>
  </p>

  {#if $data.action === 'transfer-custody'}
    <h3>For how long?</h3>
    <p>
      <MeasureInput bind:normalizedValue={$data.effortQuantity} />
      <small>(Leave blank for no limit)</small>
    </p>
  {/if}

  <h3>{temporalFormTitle}</h3>

  <p>
    {#each DATE_INPUT_TYPES as mode}
    <label>
      <input type=radio name="dateMode" value={mode} />
      {DATE_SELECTION_LABELS[mode]}
    </label>
    {/each}
    <FieldError form={form} check="dateMode.required">Please specify when you'd like things to happen.</FieldError>
  </p>

  {#if $data.dateMode !== 'none'}
  <p>
    {#if $data.dateMode === 'single'}
      <DateInput bind:value={$data.hasPointInTime} />
      <FieldError form={form} check="hasPointInTime.required">This field is required.</FieldError>
    {:else if $data.dateMode === 'after'}
      <DateInput bind:value={$data.hasBeginning} />
      <FieldError form={form} check="hasBeginning.required">This field is required.</FieldError>
    {:else if $data.dateMode === 'before'}
      <DateInput bind:value={$data.hasEnd} />
      <FieldError form={form} check="hasEnd.required">This field is required.</FieldError>
    {:else if $data.dateMode === 'range'}
      <DateInput bind:value={selectedTimeRange} selectRange={true}/>
      <FieldError form={form} check="hasBeginning.required">This field is required.</FieldError>
      <FieldError form={form} check="hasEnd.required">This field is required.</FieldError>
    {/if}
  </p>
  {/if}

  <!-- <p>
    <label for="name">Title</label>
    <textarea id="name" bind:value="{$name.value}" />
    <FieldError form={form} check="name.required">This field is required.</FieldError>
  </p> -->

  <!-- <p>
    <label for="note">Notes</label>
    <textarea id="note" bind:value="{$note.value}" />
    <FieldError form={form} check="note.required">This field is required.</FieldError>
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
