
import { configureStore } from "@reduxjs/toolkit"; 
import layersReducer from "../features/layers/layersSlice"; 
import interactionsReducer from "../features/interactions/interactionsSlice";
import consultLayerReducer from "../features/consults/consultsSlice";

export const store = configureStore({
  reducer: {
    layers: layersReducer,
    interactions: interactionsReducer,
    consultLayer: consultLayerReducer,
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
  
}); // se puede dividir el estado en multiples archivos,