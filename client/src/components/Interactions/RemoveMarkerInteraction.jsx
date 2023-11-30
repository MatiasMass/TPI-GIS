import { useContext, useEffect } from "react";
import { DragBox } from "ol/interaction";
import { always } from "ol/events/condition";
import { useSelector } from "react-redux";
import { removeMarkers } from "../../services/mapService";
import MapContext from "../Maps/MapContext";

const RemoveMarkerInteraction = ({ markersLayerSource }) => {

  const options = useSelector((state) => state.interactions.options);
  const selectedOption = options.filter(
    (option) => option.id === "removeMarker"
  )[0];

  const { map } = useContext(MapContext);

  const handleIntersectedFeatures = async (evt) => {
    try {
      const interactionExtent = evt.target.getGeometry().getExtent();
      const interactionCoordinates = evt.target.getGeometry().getCoordinates();
      markersLayerSource.forEachFeatureIntersectingExtent(
        interactionExtent,
        (feature) => {
          markersLayerSource.removeFeature(feature);
          const overlay = feature.get("overlay");
          map.removeOverlay(overlay);
        }
      );
      const response = await removeMarkers(interactionCoordinates);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!map) return;

    const dragBox = new DragBox({
      className: "bg-red-500 opacity-50",
      condition: always,
    });

    dragBox.on("boxend", handleIntersectedFeatures);

    if (selectedOption.selected === true) {
      map.addInteraction(dragBox);
    } else {
      map.removeInteraction(dragBox);
    }
    return () => {
      dragBox.un("boxend", handleIntersectedFeatures);
    };
  }, [selectedOption]);

  return <></>;
};

export default RemoveMarkerInteraction;
