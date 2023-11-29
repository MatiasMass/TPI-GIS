import { createSlice } from "@reduxjs/toolkit";

const initialMapView = {
  center: [-61, -26],
  zoom: 7.5,
  projection: 'EPSG:4326'
};

export const mapSlice = createSlice({
  name: "map",
  initialState: {
    mapView: initialMapView,
    target: null, // Puedes almacenar el target aquí si es necesario
  },
  reducers: {
    showMap: (state, action) => {
      console.log('todo bien');
      console.log(state, action);
    },
    setMapView: (state, action) => {
      state.mapView = action.payload;
    },
    setTarget: (state, action) => {
      state.target = action.payload;
    }
  },
});

export const { showMap, setMapView, setTarget } = mapSlice.actions;

export default mapSlice.reducer;