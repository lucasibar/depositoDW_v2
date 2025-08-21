import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registros: [],
  proveedores: [],
  items: [],
  loading: false,
  error: null
};

const adicionesRapidasSlice = createSlice({
  name: 'adicionesRapidas',
  initialState,
  reducers: {
    agregarRegistro: (state, action) => {
      console.log('Slice: Agregando registro:', action.payload);
      console.log('Slice: Registros antes:', state.registros.length);
      state.registros.push(action.payload);
      console.log('Slice: Registros después:', state.registros.length);
    },
    limpiarRegistros: (state) => {
      state.registros = [];
    },
    eliminarRegistro: (state, action) => {
      state.registros = state.registros.filter((_, index) => index !== action.payload);
    },
    setProveedores: (state, action) => {
      state.proveedores = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  agregarRegistro, 
  limpiarRegistros, 
  eliminarRegistro, 
  setProveedores, 
  setItems, 
  setLoading, 
  setError 
} = adicionesRapidasSlice.actions;
export default adicionesRapidasSlice.reducer;
