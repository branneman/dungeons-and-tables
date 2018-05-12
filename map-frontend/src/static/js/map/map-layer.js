import Tile from 'ol/layer/tile'
import XYZ from 'ol/source/xyz'

export const getLayer = () =>
  new Tile({
    source: new XYZ({
      url: 'http://localhost:8081/{z}/{y}/{x}.png',
      wrapX: false,
      minZoom: 0,
      maxZoom: 5
    })
  })
