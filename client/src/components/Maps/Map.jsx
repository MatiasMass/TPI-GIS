import React, { useRef, useEffect, useState } from "react";
import * as ol from "ol";
import TileLayer from "ol/layer/Tile.js";
import TileWMS from "ol/source/TileWMS.js";
import MapContext from "./MapContext";

const Map = ({ children }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initialMap = new ol.Map({
      view: new ol.View({
        center: [-61, -26],
        zoom: 7.5,
        projection: "EPSG:4326",
      }),
      layers: [
        new TileLayer({
          title: "Base Map",
          source: new TileWMS({
            url: "https://wms.ign.gob.ar/geoserver/ows",
            params: {
              LAYERS: "capabaseargenmap",
              VERSION: "1.1.1",
            },
          }),
        }),
      ],
      projection: "EPSG:4326",
    });

    initialMap.setTarget(mapRef.current);
    setMap(initialMap);

    return () => initialMap.setTarget(undefined);
  }, []);


  return (
    <MapContext.Provider value={{ map }}>
      <div className="flex justify-center items-center w-[100%]">
        <div ref={mapRef} id="ol-map" className="ol-map w-[100%] h-[100vh] relative">
          {children}
        </div>
      </div>
    </MapContext.Provider>
  );
};

export default Map;
