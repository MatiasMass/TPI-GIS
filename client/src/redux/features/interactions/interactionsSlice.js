import { createSlice } from "@reduxjs/toolkit";

export const interactionsSlice = createSlice({
  name: "interactions",
  initialState: {
    options: [
      {
        id: "navigation",
        selected: true,
        name: "Navegar"
      },
      {
        id: "consultation",
        selected: false,
        name: "Consultar"
      },
      {
        id: "measurement",
        selected: false,
        name: "Medir Distancia"
      },
      {
        id: "addMarker",
        selected: false,
        name: "Agregar Marcador"
      },
      {
        id: "removeMarker",
        selected: false,
        name: "Eliminar Marcador"
      },
      // {
      //   id: "removeAll",
      //   selected: false,
      //   name: "Eliminar Todo"
      // }
    ],
  },
  reducers: {
    toggleSelectedOption: (state, action) => {
        const id = action.payload;
        state.options = state.options.map((option) =>
          option.id === id
            ? { ...option, selected: true }
            : { ...option, selected: false }
        );
      },
      setToFalse: (state, action) => {
        const id = action.payload;
        state.options = state.options.map((option) =>
          option.id === id ? { ...option, selected: false } : { ...option }
        );
      },
  },
});

export const { toggleSelectedOption,  setToFalse} =
  interactionsSlice.actions;

export default interactionsSlice.reducer;
