<template>
  <ol-vector-layer
    v-if="results.length > 0"
    :title="layerIdentifier"
    :zIndex="1"
  >
    <ol-source-vector :zIndex="0" :url="areaUrl" :format="shapeFormat">
    </ol-source-vector>
    <ol-style>
      <ol-style-stroke :color="lineColor" width="2"></ol-style-stroke>
      <ol-style-fill :color="fillColor"></ol-style-fill>
    </ol-style>
  </ol-vector-layer>
</template>

<script setup lang="ts">
import { GeoJSON } from 'ol/format'
import { Style, Fill, Stroke } from 'ol/style'
import { computed, inject, onMounted, nextTick } from 'vue'
interface Props {
  results: any[]
  lineColor?: string | Number[]
  fillColor?: string | Number[]
  areaDataKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  results: () => [],
  lineColor: () => [102, 102, 102, 1],
  fillColor: () => [26, 26, 26, 0.1],
  areaDataKey: 'field_postcode'
})

const areas = computed(() => {
  const matches = props.results.filter((itm) => {
    return !itm.lat && itm[props.areaDataKey]
  })
  return matches
})

const mappedAreas = computed(() => {
  return areas.value.map((area) => `'${area[props.areaDataKey]}'`)
})
const shapeFormat = new GeoJSON()

const areaUrl = computed(() => {
  const baseArcGISURL =
    'https://services6.arcgis.com/GB33F62SbDxJjwEL/ArcGIS/rest/services/Vicmap_Admin/FeatureServer/14/query'
  const query = `postcode IN (${mappedAreas.value.join(',')})`
  const inSR = '4326'
  return `${baseArcGISURL}?where=${query}&geometryType=esriGeometryEnvelope&inSR=${inSR}&spatialRel=esriSpatialRelIntersects&units=esriSRUnit_Meter&returnGeodetic=false&outFields=postcode&returnGeometry=true&returnCentroid=false&f=pgeojson&token=`
})
const { rplMapRef, popup } = inject('rplMapInstance')

const defaultStyleFn = new Style({
  fill: new Fill({
    color: props.fillColor
  }),
  stroke: new Stroke({
    color: props.lineColor,
    width: 2
  })
})
const mouseOverStyleFn = new Style({
  fill: new Fill({
    color: [26, 26, 26, 0.15]
  }),
  stroke: new Stroke({
    color: props.lineColor,
    width: 2
  })
})

const layerIdentifier = 'shapeLayer'

const centerOnPopup = (map, popup, offset = { y: -100, x: 0 }) => {
  const view = map.getView()
  const resolution = view.getResolution()
  const offsetCoord = [
    popup.value.position[0] + offset.x * resolution,
    popup.value.position[1] + offset.y * resolution
  ]

  view.animate({
    center: offsetCoord,
    duration: 600
  })
}

onMounted(async () => {
  await nextTick()
  if (rplMapRef.value) {
    const map = rplMapRef.value

    // Get reference to shapeLayer by title identifier
    const allLayers = map.getLayers().getArray()
    const shapeLayer = Array.from(allLayers).find(
      (layer) => layer.get('title') === layerIdentifier
    )
    // shapeLayer.dispatchChangeEvent()
    // define filter for getting only shapeLayer
    const layerFilter = (feature, layer) => {
      if (layer.get('title') === layerIdentifier) {
        return feature
      }
    }

    map.on('singleclick', function (evt) {
      const clickedFeatures = []
      // We need to keep track of features that are clicked outside of the shape layer, so that pins can take priority over the shape
      const outOfLayerClickedFeatures = []

      // Get the features at the click position
      map.forEachFeatureAtPixel(
        evt.pixel,
        (f, layer) => {
          if (layer.get('title') === layerIdentifier) {
            clickedFeatures.push(f)
          } else {
            outOfLayerClickedFeatures.push(f)
          }
        },
        {
          hitTolerance: 5
        }
      )

      if (outOfLayerClickedFeatures.length || !clickedFeatures.length) {
        return
      }
      const feature = clickedFeatures[0]

      const matchingResult = areas.value.filter((itm) => {
        return itm.field_postcode[0] === feature?.get('postcode')
      })

      popup.value.isArea = true
      popup.value.feature = Array.isArray(matchingResult)
        ? matchingResult
        : [matchingResult]
      popup.value.isOpen = true
      popup.value.position = evt.coordinate
      centerOnPopup(map, popup)
    })
    // Add a pointermove event listener to the map to detect shape hover
    map.on('pointermove', function (evt) {
      // Get the features at the mouse position
      const feature = map.forEachFeatureAtPixel(evt.pixel, layerFilter, {
        hitTolerance: 5
      })
      // reset all shapes not hovered
      if (shapeLayer) {
        const shapeSource = shapeLayer.getSource()
        if (shapeSource) {
          const shapeFeatures = shapeSource.getFeatures()
          if (shapeFeatures) {
            shapeFeatures.forEach(function (feature) {
              feature.setStyle(defaultStyleFn)
            })
          }
        }
      }
      // Change the style for the hovered shape on mouseover
      if (feature) {
        document.querySelector('canvas').style.cursor = 'pointer'
        feature.setStyle(mouseOverStyleFn)
      }
    })
  }
})
</script>
