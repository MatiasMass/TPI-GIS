import { useEffect, useState, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { Feature, Overlay } from "ol";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";
import { postMarker } from "../../services/mapService"; 
import GeoJSON from "ol/format/GeoJSON";
import MapContext from "../Maps/MapContext";

const AddMarkerInteraction = ({ markersLayerSource }) => {
  const options = useSelector((state) => state.interactions.options);
  const selectedOption = options.filter(
    (option) => option.id === "addMarker"
  )[0];

  const { map } = useContext(MapContext);

  const popUpRef = useRef(null);

  const [isShown, setIsShown] = useState(false);

  const addMarker = (evt) => {
    if (isShown) return;

    const iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        displacement: [0, 13],
        src: "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png",
      }),
    });
    const feature = new Feature({
      geometry: new Point(evt.coordinate),
    });
    feature.setStyle(iconStyle);
    const overlay = new Overlay({
      position: evt.coordinate,
      element: popUpRef.current,
    });
    map.addOverlay(overlay);
    markersLayerSource.addFeature(feature);
    setIsShown(() => true);
  };

  const handleRemoveMarker = () => {
    setIsShown(() => false);
    const feature = markersLayerSource.getFeatures().reverse()[0];
    markersLayerSource.removeFeature(feature);
  };

  const handleSubmit = async (evt) => {
    const form = evt.target;
    try {
      evt.preventDefault();
      const name = form.name.value;
      const description = form.description.value;
      const feature = markersLayerSource.getFeatures().reverse()[0];
      const div = document.createElement("div");
      div.className = "p-2 bg-gray-100 rounded-md shadow-md";
      div.innerHTML = `
      <h3>Nombre: ${name}</h3>
      <p>Descripcion: ${description}</p>`;
      const overlay = new Overlay({
        offset: [0, -30],
        positioning: "bottom-center",
        position: feature.getGeometry().getCoordinates(),
        element: div,
      });
      map.addOverlay(overlay);
      feature.setProperties({ name, description });
      const format = new GeoJSON();
      const geojson = format.writeFeatureObject(feature);
      const response = await postMarker(geojson);
      feature.setProperties({ overlay });
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      form.reset();
      setIsShown(() => false);
    }
  };

  useEffect(() => {
    if (!map) return;

    if (selectedOption.selected === true) {
      map.on("click", addMarker);
    } else {
      map.un("click", addMarker);
    }
    return () => {
      map.un("click", addMarker);
    };
  }, [selectedOption, isShown]);

  return (
    <form ref={popUpRef} onSubmit={handleSubmit}>
      {isShown && (
        <div className="bgRed p-5 rounded-lg gap-3 flex flex-col">
          <div className="flex flex-col gap-2">
            <label
              className="bg-red-300 rounded-md p-1.5 text-black"
              htmlFor="name"
            >
              Nombre del lugar
            </label>
            <input
              className=" p-1.5 rounded-md text-black"
              type="text"
              name="name"
              required
              placeholder="Nombre del lugar"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="bg-red-300 rounded-md p-1.5 text-black"
              htmlFor="description"
            >
              Descripción
            </label>
            <input
              className=" p-1.5 rounded-md text-black"
              type="text"
              name="description"
              placeholder="Descripción"
              required
            />
          </div>
          <button
            className="bg-red-300 rounded-md p-2 text-black"
            type="submit"
          >
            Guardar
          </button>
          <button
            className="bg-red-800 text-black rounded-full py-3 px-4 absolute -top-5 -right-4 text-xs"
            type="button"
            onClick={handleRemoveMarker}
          >
            x
          </button>
        </div>
      )}
    </form>
  );
};

export default AddMarkerInteraction;
