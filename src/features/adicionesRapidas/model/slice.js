import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registros: [],
  loading: false,
  error: null
};

const adicionesRapidasSlice = createSlice({
  name: 'adicionesRapidas',
  initialState,
  reducers: {
    agregarRegistro: (state, action) => {
      state.registros.push(action.payload);
    },
    limpiarRegistros: (state) => {
      state.registros = [];
    },
    eliminarRegistro: (state, action) => {
      state.registros = state.registros.filter((_, index) => index !== action.payload);
    }
  }
});

export const { agregarRegistro, limpiarRegistros, eliminarRegistro } = adicionesRapidasSlice.actions;
export default adicionesRapidasSlice.reducer;
