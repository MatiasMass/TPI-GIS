import Tools from "./Tools/Tools";
import "./Home.css";
import Map from "./Maps/Map";
import LayersPanel from "./LayersPanel/LayersPanel";
// import Leyend from "./Leyend/Leyend";
import Controls from "./Controls/Controls";
import ScaleMap from "./Controls/ScaleMap";
import FullScreenMap from "./Controls/FullScreen";
import { useEffect, useState } from "react";
import FrontPage from "./FrontPage/FrontPage";
import Interactions from "./Interactions/Interactions";
import MeasureInteraction from "./Interactions/MeasureInteraction";
import RemoveMarkerInteraction from "./Interactions/RemoveMarkerInteraction";
import VectorSource from "ol/source/Vector";
import CircleStyle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import AddMarkerInteraction from "./Interactions/AddMarkerInteraction";
import NavigationInteraction from "./Interactions/NavigationInteraction";
import DragBoxInteraction from "./Interactions/DragBoxInteraction";
import Layers from "./Layers/Layers";
import TileLayer from "./Layers/TileLayer";
import ImageLayer from "./Layers/ImageLayer";
import { ImageWMS, TileWMS } from "ol/source";
import VectorLayer from "./Layers/VectorLayer";
import { useSelector } from "react-redux";
import Leyend from "./Leyend/Leyend";
import { getMarkers } from "../services/mapService";
import GeoJSON from 'ol/format/GeoJSON'
import Modal from "./Modal/Modal";

const url = `http://qgis.demo/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/TPI.qgz`;

function Home() {
  const [loading, setLoading] = useState(true); // cambiar a true
  const availableLayers = useSelector((store) => store.layers.availableLayers);
  const consultLayer = useSelector(state => state.consultLayer.consults)

  const [measureLayerSource, setMeasureLayerSource] = useState(
    new VectorSource()
  );
  const [markersLayerSource, setMarkersLayerSource] = useState(
    new VectorSource()
  );

  const [consultLayerSource, setConsultLayerSource] = useState(
    new VectorSource()
  );

  const [showModal, setShowModal] = useState(false)


  const styleFunction = () => {
    return new Style({
      stroke: new Stroke({
        color: "rgba(255, 0, 0, 1)",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(255, 0, 0, 0.2)",
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.2)",
        }),
      }),
    });
  };

  const style = () =>
    new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.5)",
        lineDash: [10, 10],
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
      }),
    });

  // front page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    (async function () {
      const response = await getMarkers()
      console.log(response)
      const format = new GeoJSON()
      const features = format.readFeatures(response)
      const source = new VectorSource({
        features
      })
      setMarkersLayerSource(() => source)
    }())
    return () => {
      setMarkersLayerSource(() => new VectorSource())
    }
  }, [])

  useEffect(() => {
    const format = new GeoJSON()
    const source = new VectorSource()

    Object.entries(consultLayer).forEach(([layer, value]) => {
      const features = format.readFeatures(value)
      source.addFeatures(features)
    })
    setShowModal(true)
    setConsultLayerSource(source)
    return () => {
      setConsultLayerSource(() => new VectorSource())
    }
  }, [consultLayer])


  const options = {
    url: url,
    params: {
      LAYERS: "capabaseargenmap",
    },
    serverType: "qgis",
    crossOrigin: "anonymous",
  };

  return (
    <div className="flex flex-row w-[100wh] min-h-[100vh] bg-[#0B4F6C] ">
      {loading ? (
        <div className="w-[100%] h-[100vh] flex justify-center items-start frontpage">
          <FrontPage />
        </div>
      ) : (
        <>
          <Tools />
          <Leyend url={url} />

          <div
            className="
          w-[93%] min-h-[100vh] bg-slate-500
          relative
          "
          >
            <Map>
              <Layers>
                <TileLayer
                  source={
                    new TileWMS({
                      url: "https://wms.ign.gob.ar/geoserver/ows",
                      params: {
                        LAYERS: "capabaseargenmap",
                      },
                    })
                  }
                  zIndex={0}
                />
                {availableLayers.map((layer) => (
                  <div key={layer.name}>
                    {layer.visible && (
                      <ImageLayer
                        key={layer.name}
                        source={
                          new ImageWMS({
                            ...options,
                            params: { LAYERS: layer.sourceName.toLowerCase() },
                          })
                        }
                        zIndex={layer.zIndex}
                      />
                    )}
                  </div>
                ))}
                <VectorLayer
                  source={measureLayerSource}
                  style={{
                    "fill-color": "rgba(255, 255, 255, 0.2)",
                    "stroke-color": "#ffcc33",
                    "stroke-width": 2,
                    "circle-radius": 7,
                    "circle-fill-color": "#ffcc33",
                  }}
                  zIndex="4"
                />
                <VectorLayer
                  zIndex={5}
                  source={consultLayerSource}
                  style={styleFunction}
                />
                <VectorLayer zIndex={6} source={markersLayerSource} marker />
              </Layers>
              <Interactions>
                <NavigationInteraction />
                <DragBoxInteraction />

                <MeasureInteraction
                  drawOptions={{
                    source: measureLayerSource,
                    type: "LineString",
                    style: style,
                  }}
                />
                <AddMarkerInteraction markersLayerSource={markersLayerSource} />
                <RemoveMarkerInteraction
                  markersLayerSource={markersLayerSource}
                />
              </Interactions>
              <Controls>
                <FullScreenMap />
                <ScaleMap />
              </Controls>
            </Map>
            <LayersPanel />
            
            <Modal showModal={showModal} setShowModal={setShowModal} />
         

          </div>
        </>
      )}
    </div>
  );
}

export default Home;
