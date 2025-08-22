import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registros: [],
  proveedores: [],
  items: [],
  clientes: [], // Proveedores filtrados por categoría "clientes"
  loading: false,
  error: null
};

const salidaSlice = createSlice({
  name: 'salida',
  initialState,
  reducers: {
    agregarRegistroSalida: (state, action) => {
      console.log('Slice Salida: Agregando registro:', action.payload);
      console.log('Slice Salida: Registros antes:', state.registros.length);
      state.registros.push(action.payload);
      console.log('Slice Salida: Registros después:', state.registros.length);
    },
    limpiarRegistrosSalida: (state) => {
      state.registros = [];
    },
    eliminarRegistroSalida: (state, action) => {
      state.registros = state.registros.filter((_, index) => index !== action.payload);
    },
    marcarRegistroConError: (state, action) => {
      const { itemId, partidaId, posicionId, error } = action.payload;
      const registro = state.registros.find(r => 
        r.item.id === itemId && 
        r.partida.id === partidaId && 
        r.posicion.id === posicionId
      );
      if (registro) {
        registro.error = error;
        registro.tieneError = true;
      }
    },
    limpiarErroresRegistros: (state) => {
      state.registros.forEach(registro => {
        delete registro.error;
        delete registro.tieneError;
      });
    },
    setProveedoresSalida: (state, action) => {
      console.log('Slice: Guardando proveedores:', action.payload);
      state.proveedores = action.payload;
    },
    setClientesSalida: (state, action) => {
      console.log('Slice: Guardando clientes:', action.payload);
      state.clientes = action.payload;
    },
               setItemsSalida: (state, action) => {
             console.log('Slice: Guardando items:', action.payload);
             console.log('Slice: Cantidad de items:', action.payload?.length);
             console.log('Slice: Primeros 3 items:', action.payload?.slice(0, 3));
             state.items = action.payload;
           },
    setLoadingSalida: (state, action) => {
      state.loading = action.payload;
    },
    setErrorSalida: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  agregarRegistroSalida, 
  limpiarRegistrosSalida, 
  eliminarRegistroSalida, 
  marcarRegistroConError,
  limpiarErroresRegistros,
  setProveedoresSalida, 
  setClientesSalida,
  setItemsSalida, 
  setLoadingSalida, 
  setErrorSalida 
} = salidaSlice.actions;
export default salidaSlice.reducer;
