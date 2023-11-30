import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import MapContext from "../Maps/MapContext";

const NavigationInteraction = ({ dragBox }) => {
  const options = useSelector((state) => state.interactions.options);
  const selectedOption = options.filter(
    (option) => option.id === "navigation"
  )[0];

  const { map } = useContext(MapContext);
  const mouseCoordinates = function (coordinate) {
    console.log(coordinate);
    if (coordinate.length == 2) {
      //es un punto [lon,lat]
      var wkt = "POINT(" + coordinate[0] + " " + coordinate[1] + ")";
    } else {
      //es un poligono en la forma [ [ [lon,lat],[lon,lat],....] ]
      var wkt = "POLYGON((";
      for (var i = 0; i < coordinate[0].length - 1; i++) {
        wkt += coordinate[0][i][0] + " " + coordinate[0][i][1] + ",";
      }
      wkt += coordinate[0][0][0] + " " + coordinate[0][0][1] + "))";
    }
    console.log(wkt);
    window.open("consulta.php?wkt=" + wkt);
    return;
  };

  const clickOnMap = function (evt) {
    //muestro por consola las coordenadas del evento
    console.log("click", evt.coordinate);
    mouseCoordinates(evt.coordinate);
  };

  useEffect(() => {
    if (!map) return;

    if (selectedOption.selected === true) {
      map.removeInteraction(dragBox);
      map.un("click", clickOnMap);
    }
  }, [selectedOption]);

  return <></>;
};

export default NavigationInteraction;
