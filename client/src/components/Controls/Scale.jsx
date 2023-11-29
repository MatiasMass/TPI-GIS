import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { addControl, removeControl } from "../../redux/features/map/mapSlice";

const Scale = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const scaleOptions = {
  //     units: "metric",
  //     bar: true,
  //     steps: parseInt(4, 10),
  //     text: true,
  //     minWidth: 140,
  //   };

  //   dispatch(addControl(scaleOptions));

  //   // No es necesario hacer nada en el return ya que estás manejando la eliminación en el reducer
  // }, [dispatch]);

  return null;
};
export default Scale;
