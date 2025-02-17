<template>
  <RplMapSidePanel
    v-if="variant === 'desktop' || (variant === 'mobile' && !popup?.isOpen)"
    :isBusy="isBusy"
    :isStandalone="variant === 'mobile'"
    :class="`tide-search-sidepanel--${variant}`"
    :pagingStart="pagingStart"
    :pagingEnd="pagingEnd"
    :totalResults="totalResults"
    :currentPage="currentPage"
    :totalPages="totalPages"
    @paginate="handlePageChange"
  >
    <div
      v-if="!isBusy && !results?.length"
      class="tide-search-sidepanel-noresults"
    >
      <slot name="noresults"></slot>
    </div>
    <component
      :is="
        mapConfig.sidePanel?.resultsComponent ||
        'TideSearchResultMapSidepanelItem'
      "
      v-for="item in results"
      :key="item.id"
      v-bind="item.props"
      :isActive="
        popup?.isOpen &&
        getItemId(item.props.result) ===
          (popup?.feature ? getItemId(popup?.feature[0]) : '')
      "
      @click="handleSidePanelClick(item, activatePin)"
    />
  </RplMapSidePanel>

  <div
    v-if="variant === 'mobile'"
    ref="mobilePopupRef"
    :class="`tide-search-sidepanel--${variant}`"
  >
    <RplMapPopUp
      type="standalone"
      :isOpen="popup?.isOpen"
      @close="popup.isOpen = false"
    >
      <template #header>
        <TideSearchListingResultsPopupTitle
          :popupConfig="mapConfig.props.popup"
          :titleObjPath="mapConfig.props.titleObjPath"
        />
      </template>
      <TideSearchListingResultsPopupContent
        :popupConfig="mapConfig.props.popup"
        :titleObjPath="mapConfig.props.titleObjPath"
      />
    </RplMapPopUp>
  </div>
</template>

<script setup lang="ts">
import { get } from 'lodash-es'
import { fromLonLat, transformExtent } from 'ol/proj'
import { Extent } from 'ol/extent'
import { scrollToElementTopWithOffset } from '#imports'

interface Props {
  variant: 'mobile' | 'desktop'
  mapConfig: any
  results: any
  activatePin: any
  mapHeight: number
  showToggle: boolean
  isStandalone: boolean
  isBusy: boolean
  panelLocation?: 'left' | 'right'
  pagingStart: number
  pagingEnd: number
  totalResults: number
  totalPages: number
  currentPage: number
}

const props = withDefaults(defineProps<Props>(), {
  panelLocation: 'left',
  isStandalone: false,
  showToggle: false
})

const emit = defineEmits<{
  (
    e: 'paginate',
    payload: rplEventPayload & { action: 'prev' | 'next' | 'page' }
  ): void
}>()

const { rplMapRef, popup, deadSpace } = inject('rplMapInstance')

const route = useRoute()
const mobilePopupRef = ref(null)

const handleSidePanelClick = async (item, activatePin) => {
  const location = get(
    item.props.result,
    props.mapConfig?.props?.locationObjPath
  )

  if (item.props) {
    let coords = null

    if (location) {
      const locationLatLng = location.split(',')
      const lat = parseFloat(locationLatLng[0])
      const lng = parseFloat(locationLatLng[1])
      coords = fromLonLat([lng, lat])

      activatePin(item.props.result, coords)
    } else {
      popup.value.feature = [item.props.result]
      popup.value.isOpen = true
      popup.value.isArea = false
      popup.value.position = null

      if (route.query['location[bbox]']) {
        const bbox: Extent = transformExtent(
          route.query['location[bbox]'].map((val) => parseFloat(val)),
          'EPSG:4326',
          'EPSG:3857'
        )

        await nextTick()
        fitExtent(rplMapRef.value, bbox, deadSpace.value)
      } else {
        await nextTick()
        fitVictoria(rplMapRef.value, deadSpace.value)
      }
    }
  }

  await nextTick()

  if (mobilePopupRef.value) {
    scrollToElementTopWithOffset(mobilePopupRef.value, 72, false)
  }
}

const handlePageChange = (event) => {
  emit('paginate', event)
}

const getItemId = (item) => {
  if (!item) return ''

  return get(item, props.mapConfig?.sidePanel?.itemIdObjPath || 'unique_id')
}
</script>

<style>
@import '@dpc-sdp/ripple-ui-core/style/breakpoints';

.tide-search-sidepanel--mobile {
  @media (--rpl-bp-m) {
    display: none;
  }
}

.tide-search-sidepanel--desktop {
  display: none;

  @media (--rpl-bp-m) {
    display: block;
  }
}

.tide-search-sidepanel-noresults {
  padding: var(--rpl-sp-4) var(--rpl-sp-2) var(--rpl-sp-8) var(--rpl-sp-2);
}
</style>
