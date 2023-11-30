import { createSlice } from '@reduxjs/toolkit';

export const consultLayerSlice = createSlice({
  name: 'consultLayer',
  initialState: {
    consults: [],
  },
  reducers: {
    setConsultLayer: (state, action) => {
      state.consults = action.payload;
    },
    clearConsultLayer: (state) => {
      return [];
    },
  },
});

export const { setConsultLayer, clearConsultLayer } = consultLayerSlice.actions;

export default consultLayerSlice.reducer;
