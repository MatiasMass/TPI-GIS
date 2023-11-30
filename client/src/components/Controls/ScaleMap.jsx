import { useContext, useEffect } from 'react'
import { ScaleLine } from 'ol/control'
import MapContext from '../Maps/MapContext'

const ScaleMap = () => {
  const {map} = useContext(MapContext)

  useEffect(() => {
    if (!map) return

    const scaleControl = new ScaleLine({
      units: 'metric',
      bar: true,
      steps: parseInt(4, 10),
      text: true,
      minWidth: 140
    })

    map.controls.push(scaleControl)

    return () => map.controls.remove(scaleControl)
  }, [map])

  return null
}

export default ScaleMap
