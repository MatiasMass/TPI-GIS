
import { configureStore } from "@reduxjs/toolkit"; 
import layersReducer from "../features/layers/layersSlice"; 
import interactionsReducer from "../features/interactions/interactionsSlice";

export const store = configureStore({
  reducer: {
    layers: layersReducer,
    interactions: interactionsReducer,
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
  
}); // se puede dividir el estado en multiples archivos,