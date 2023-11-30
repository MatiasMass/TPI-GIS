
import { useContext, useEffect } from 'react'
import { DragBox } from 'ol/interaction'
import { always } from 'ol/events/condition'
import { useDispatch, useSelector } from 'react-redux'
import { getIntersectedFeatures } from '../../services/mapService' 
import MapContext from '../Maps/MapContext'
import { setConsultLayer } from '../../redux/features/consults/consultsSlice'

const DragBoxInteraction = () => {
  const options = useSelector((state) => state.interactions.options);
  const selectedOption = options.filter(
    (option) => option.id === "consultation"
  )[0];
  
  const layers = useSelector(store => store.layers.availableLayers)
  const visibleLayers = layers.filter(layer => layer.visible)
    
  const { map } = useContext(MapContext);

  const dispatch = useDispatch()

  const handleIntersectedFeatures = (interactionCoordinates) => {
    if (visibleLayers.length === 0) return
    getIntersectedFeatures(visibleLayers, interactionCoordinates).then((response) => {
      // const responseToList = Object.entries(response).map(([layer, { features }]) => {
      //   return {
      //     layer,
      //     features
      //   }
      // })

      dispatch(setConsultLayer(response))
    })
  }

  const getPointCoordinates = function (evt) {
    const interactionCoordinates = evt.coordinate
    handleIntersectedFeatures(interactionCoordinates)
  }

  const getBoxCoordinates = (evt) => {
    const interactionCoordinates = evt.target.getGeometry().getCoordinates()
    handleIntersectedFeatures(interactionCoordinates)
  }
  
  useEffect(() => {
    if (!map) return

    const dragBox = new DragBox({
      className: 'bg-red-500 opacity-50',
      condition: always
    })

    dragBox.on('boxend', getBoxCoordinates)

    if (selectedOption.selected) {
      map.addInteraction(dragBox)
      map.on('click', getPointCoordinates)
    } else {
      map.removeInteraction(dragBox)
      map.un('click', getPointCoordinates)
    }
    return () => {
      dragBox.un('boxend', getBoxCoordinates)
      map.un('click', getPointCoordinates)
      map.removeInteraction(dragBox)
    }
  }, [selectedOption, visibleLayers])

  return null
}

export default DragBoxInteraction
