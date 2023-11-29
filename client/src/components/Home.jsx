import Tools from "./Tools/Tools";
import "./Home.css";
import Map from "./Maps/Map";
import LayersPanel from "./LayersPanel/LayersPanel";
import Leyend from "./Leyend/Leyend";
import Controls from "./Controls/Controls";
import Scale from "./Controls/Scale";
import { useEffect, useState } from "react";
import FrontPage from "./FrontPage/FrontPage";
import Interactions from "./Interactions/Interactions";
import MeasureInteraction from "./Interactions/MeasureInteraction";
import VectorSource from "ol/source/Vector";
import CircleStyle from 'ol/style/Circle'
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";

const url = "3wqeqwde";

function Home() {
  const [loading, setLoading] = useState(false); // cambiar a true

  const [measureLayerSource, setMeasureLayerSource] = useState(
    new VectorSource()
  );

  const style = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
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

  return (
    <div className="flex flex-row w-[100wh] min-h-[100vh] bg-[#0B4F6C] ">
      {loading ? (
        <div className="w-[100%] h-[100vh] flex justify-center items-start frontpage">
          <FrontPage />
        </div>
      ) : (
        <>
          <Tools />

          <div
            className="
          w-[93%] min-h-[100vh] bg-slate-500
          relative
          "
          >
            <Map>
              <Interactions>
                <MeasureInteraction 
                  drawOptions={{
                    source: measureLayerSource,
                    type: "LineString",
                    style: style,
                  }}
                />
              </Interactions>
            </Map>
            <LayersPanel />
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
