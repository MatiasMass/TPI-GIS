import { useContext, useEffect } from 'react'
import { Image } from 'ol/layer'
import MapContext from '../Maps/MapContext'

const ImageLayer = ({ source, zIndex = 0 }) => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return

    const imageLayer = new Image({
      source,
      zIndex
    })

    map.addLayer(imageLayer)
    imageLayer.setZIndex(zIndex)

    return () => {
      if (map) {
        map.removeLayer(imageLayer)
      }
    }
  }, [map])

  return null
}

export default ImageLayer
