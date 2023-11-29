import { useEffect, useState } from "react";
import { ImageWMS } from "ol/source";

const Leyend = ({ url }) => {
  const [leyendSource, setLeyendSource] = useState("algo");

  const visibleLayers = [1, 2, 3, 4];

  useEffect(() => {
    if (visibleLayers.length > 0) {
      const wmsSource = new ImageWMS({
        url: url + "&TRANSPARENT=TRUE&ITEMFONTCOLOR=0x213547",
        params: {
          // LAYERS: visibleLayers.map(layer => layer.sourceName).join(','),
          LAYERS: "capabaseargenmap",
          FORMAT: "image/png",
        },
      });
      setLeyendSource(wmsSource.getLegendUrl());
    } else {
      setLeyendSource("");
    }
  }, [visibleLayers]);


  return (
    <>
      {leyendSource && (
        <div id="leyend" className="absolute bottom-0 left-0 z-10 bg-red-700 p-3 flex flex-col gap-2 rounded-lg text-white w-[250px] h-[130px] mx-5 my-2">
          <h6 className="bg-slate-600 rounded-md p-2">Leyenda:</h6>
          <img className="sm:max-h-[50vh]" src={leyendSource} />
        </div>
      )}
    </>
  );
};

export default Leyend;
