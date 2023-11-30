import React, { useContext, useEffect } from 'react'
import { FullScreen } from 'ol/control'
import MapContext from '../Maps/MapContext'

const FullScreenMap = () => {
  const {map} = useContext(MapContext)

  useEffect(() => {
    if (!map) return

    const fullScreen = new FullScreen({})

    map.controls.push(fullScreen)

    return () => map.controls.remove(fullScreen)
  }, [map])

  return null
}

export default FullScreenMap
