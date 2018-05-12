import Map from 'ol/map'
import View from 'ol/view'
import proj from 'ol/proj'

import { getLayer as getMapLayer } from './map-layer'

const getMinZoom = target =>
  Math.ceil(Math.LOG2E * Math.log(target.clientWidth / 256))

export const create = () => {
  const target = document.getElementById('map')
  const initialZoom = getMinZoom(target)

  return new Map({
    target: target,
    layers: [getMapLayer()],
    view: new View({
      center: [0, 0],
      minZoom: initialZoom,
      zoom: initialZoom
    })
  })
}
