<script setup lang="ts">
import RplTextLink from '../text-link/RplTextLink.vue'
import RplIcon from '../icon/RplIcon.vue'
import RplButton from '../button/RplButton.vue'
import { IRplHeaderLinkExtended } from './constants'
import { RplLink } from '../../lib/constants'
import { RplButtonVariants } from '../button/constants'
import {
  useRippleEvent,
  rplEventPayload
} from '../../composables/useRippleEvent'

interface Props {
  primary?: RplLink
  secondary?: IRplHeaderLinkExtended
  variant: RplButtonVariants
}

withDefaults(defineProps<Props>(), {
  primary: undefined,
  secondary: undefined
})

const emit = defineEmits<{
  (e: 'itemClick', payload: rplEventPayload & { action: 'click' }): void
}>()

const { emitRplEvent } = useRippleEvent('rpl-header', emit)

const handleClick = (item, type: string) => {
  emitRplEvent('itemClick', {
    action: 'click',
    text: item.text,
    value: item.url,
    section: 'actions',
    elementType: type
  })
}
</script>

<template>
  <div class="rpl-header-actions">
    <RplButton
      v-if="primary"
      :url="primary.url"
      class="rpl-header-actions__primary"
      :variant="variant"
      el="a"
      @click="() => handleClick(primary, 'button')"
    >
      {{ primary.text }}
    </RplButton>
    <div v-if="secondary" class="rpl-header-actions__secondary">
      <p
        v-if="secondary.title"
        class="rpl-header-actions__secondary-title rpl-header__text-large-fixed rpl-type-p"
      >
        {{ secondary.title }}
      </p>
      <RplTextLink
        v-if="secondary"
        :url="secondary.url"
        class="rpl-header-actions__secondary-link rpl-header__icon-link"
        @click="() => handleClick(secondary, 'link')"
      >
        <span>{{ secondary.text }}</span
        ><RplIcon name="icon-arrow-right" size="xs" />
      </RplTextLink>
    </div>
  </div>
</template>

<style src="./RplHeaderActions.css" />
