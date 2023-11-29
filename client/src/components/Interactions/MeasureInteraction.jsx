
import { useContext, useEffect, useState } from 'react'
import Draw from 'ol/interaction/Draw'
import { useSelector } from 'react-redux'
import { unByKey } from 'ol/Observable'
import { getLength } from 'ol/sphere'
import { Overlay } from 'ol'
import MapContext from '../Maps/MapContext'
import VectorLayer from 'ol/layer/Vector.js';
import * as ol from 'ol'

const formatLength = function (line) {
  const length = getLength(line, { projection: 'EPSG:4326' })
  let output
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm'
  }
  return output
}

const MeasureInteraction = ({ drawOptions }) => {

  const options = useSelector(state => state.interactions.options)
  const selectedOption = options.filter(option => option.id === "measurement")[0]

  const {map} = useContext(MapContext)

  const [draw, setDraw] = useState(null)

  let measureTooltipElement

  let measureTooltip

  function createMeasureTooltip () {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement)
    }
    measureTooltipElement = document.createElement('div')
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
    measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false
    })
    map.addOverlay(measureTooltip)
  }

  useEffect(() => {
    if (!map) return;

    const newDraw = new Draw(drawOptions);
    let sketch;
    let listener;

    createMeasureTooltip();

    newDraw.on('drawstart', function (evt) {
      sketch = evt.feature;
      let tooltipCoord = evt.coordinate;
      listener = sketch.getGeometry().on('change', function (evt) {
        const geom = evt.target;
        const output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });

    newDraw.on('drawend', function () {
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      measureTooltip.setOffset([0, -7]);
      sketch.set('overlay', measureTooltip);
      sketch = null;
      measureTooltipElement = null;
      createMeasureTooltip();
      unByKey(listener);
    });

    setDraw(newDraw);

    // Añadir la capa vectorial al mapa
    map.addLayer(new VectorLayer({
      source: drawOptions.measureLayerSource,
      style: drawOptions.style,
    }));

    return () => {
      map.removeInteraction(newDraw);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return
    
    if (selectedOption.selected === true) {
      map.addInteraction(draw)
    } else {
      map.removeInteraction(draw)
    }
  }, [selectedOption])

  return null
}

export default MeasureInteraction
