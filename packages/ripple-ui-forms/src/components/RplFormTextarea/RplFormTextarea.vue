<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRippleEvent } from '@dpc-sdp/ripple-ui-core'
import type { rplEventPayload } from '@dpc-sdp/ripple-ui-core'
import { sanitisePIIField } from '../../lib/sanitisePII'

interface Props {
  id: string
  disabled?: boolean
  className?: string
  value?: string
  name: string
  label?: string
  rows?: number
  minlength?: number
  maxlength?: number
  invalid?: boolean
  required?: boolean
  variant?: 'default' | 'reverse'
  pii?: boolean
  handlers: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  className: 'rpl-form__textarea',
  rows: 4,
  value: undefined,
  label: undefined,
  minlength: undefined,
  maxlength: undefined,
  disabled: false,
  required: false,
  invalid: false,
  variant: 'default',
  pii: true
})

const emit = defineEmits<{
  (e: 'update', payload: rplEventPayload & { action: 'update' }): void
}>()

const form: object = inject('form')

const { emitRplEvent } = useRippleEvent('rpl-form-textarea', emit)

const classes = computed(() => {
  return {
    [`${props.className}`]: props.className,
    [`${props.className}--${props.variant}`]: true,
    [`${props.className}--disabled`]: props.disabled,
    [`${props.className}--invalid`]: props.invalid
  }
})

const handleChange = () => {
  emitRplEvent(
    'update',
    {
      action: 'update',
      id: props.id,
      label: props?.label,
      value: sanitisePIIField(props.pii, props?.value),
      contextId: form?.id,
      contextName: form?.name
    },
    { global: true }
  )
}
</script>

<template>
  <div :class="classes">
    <textarea
      :id="id"
      :disabled="disabled"
      :required="required"
      :aria-required="required"
      :aria-invalid="invalid"
      :name="name"
      :value="value"
      :rows="rows"
      :minlength="minlength"
      :maxlength="maxlength"
      class="rpl-type-p rpl-u-focusable-outline"
      v-bind="$attrs"
      @blur="handlers?.blur"
      @input="handlers?.DOMInput"
      @change="handleChange"
    />
  </div>
</template>

<style src="./RplFormTextarea.css"></style>
