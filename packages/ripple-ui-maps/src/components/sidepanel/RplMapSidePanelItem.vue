<template>
  <component
    :is="el"
    role="button"
    tabIndex="0"
    :class="{
      'rpl-map-side-panel__item': true,
      'rpl-map-side-panel__item--active': isActive,
      'rpl-u-focusable-within': true
    }"
    @click="handleClick"
  >
    <div
      v-if="$slots.meta"
      class="rpl-map-side-panel__item-meta rpl-type-p-small"
    >
      <slot name="meta"></slot>
    </div>
    <div
      class="rpl-map-side-panel__item-title rpl-type-p rpl-u-focusable-inline"
    >
      {{ title }}
    </div>
    <slot></slot>
    <div
      v-if="$slots.footer"
      class="rpl-map-side-panel__item-footer rpl-type-p-small"
    >
      <slot name="footer"></slot>
    </div>
  </component>
</template>
<script setup lang="ts">
import { rplEventPayload, useRippleEvent } from '@dpc-sdp/ripple-ui-core'

interface Props {
  el?: string
  title: string
  isActive?: boolean
  data?: any
}

const props = withDefaults(defineProps<Props>(), {
  el: 'li',
  isActive: false,
  data: undefined
})

const emit = defineEmits<{
  (e: 'click', payload: rplEventPayload & { action: 'click' }): void
}>()

const { emitRplEvent } = useRippleEvent('rpl-map-side-panel', emit)

const handleClick = () => {
  emitRplEvent('click', { action: 'click', value: props.data })
}
</script>

<style src="./RplMapSidePanel.css"></style>
