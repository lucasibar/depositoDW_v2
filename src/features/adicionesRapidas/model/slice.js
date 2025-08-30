import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registros: [],
  proveedores: [],
  items: [],
  loading: false,
  error: null,
  // Estado para navegación rápida desde stock a materiales
  navegacionRapida: {
    itemSeleccionado: null,
    proveedorSeleccionado: null,
    ejecutarBusqueda: false
  },
  // Nuevo estado para navegación rápida desde materiales a posiciones
  navegacionRapidaPosiciones: {
    posicionSeleccionada: null,
    ejecutarBusqueda: false
  },
  // Nuevo estado para navegación rápida desde posiciones a stock
  navegacionRapidaStock: {
    itemSeleccionado: null,
    proveedorSeleccionado: null,
    ejecutarBusqueda: false
  }
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
    },
    // Reducers para navegación rápida desde stock a materiales
    setNavegacionRapida: (state, action) => {
      state.navegacionRapida = { ...state.navegacionRapida, ...action.payload };
    },
    limpiarNavegacionRapida: (state) => {
      state.navegacionRapida = {
        itemSeleccionado: null,
        proveedorSeleccionado: null,
        ejecutarBusqueda: false
      };
    },
    // Nuevos reducers para navegación rápida desde materiales a posiciones
    setNavegacionRapidaPosiciones: (state, action) => {
      state.navegacionRapidaPosiciones = { ...state.navegacionRapidaPosiciones, ...action.payload };
    },
    limpiarNavegacionRapidaPosiciones: (state) => {
      state.navegacionRapidaPosiciones = {
        posicionSeleccionada: null,
        ejecutarBusqueda: false
      };
    },
    // Nuevos reducers para navegación rápida desde posiciones a stock
    setNavegacionRapidaStock: (state, action) => {
      state.navegacionRapidaStock = { ...state.navegacionRapidaStock, ...action.payload };
    },
    limpiarNavegacionRapidaStock: (state) => {
      state.navegacionRapidaStock = {
        itemSeleccionado: null,
        proveedorSeleccionado: null,
        ejecutarBusqueda: false
      };
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
  setError,
  setNavegacionRapida,
  limpiarNavegacionRapida,
  setNavegacionRapidaPosiciones,
  limpiarNavegacionRapidaPosiciones,
  setNavegacionRapidaStock,
  limpiarNavegacionRapidaStock
} = adicionesRapidasSlice.actions;
export default adicionesRapidasSlice.reducer;
