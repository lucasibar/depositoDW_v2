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
        r.partida === partidaId && 
        `${r.rack}${r.fila}${r.nivel}${r.pasillo}` === posicionId
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
    eliminarRegistrosExitosos: (state, action) => {
      const { exitosos } = action.payload;
      console.log('Eliminando registros exitosos:', exitosos);
      
      // Eliminar registros que se procesaron exitosamente
      state.registros = state.registros.filter(registro => {
        const esExitoso = exitosos.some(exitoso => 
          exitoso.itemId === registro.item.id &&
          exitoso.partidaId === registro.partida &&
          // Comparar posición usando los campos individuales
          ((exitoso.posicionId && registro.posicionId && exitoso.posicionId === registro.posicionId) ||
           (exitoso.posicionInfo && 
            exitoso.posicionInfo.rack === registro.rack &&
            exitoso.posicionInfo.fila === registro.fila &&
            exitoso.posicionInfo.nivel === registro.nivel &&
            exitoso.posicionInfo.pasillo === registro.pasillo))
        );
        
        if (esExitoso) {
          console.log('Eliminando registro exitoso:', registro);
        }
        
        return !esExitoso; // Mantener solo los que NO fueron exitosos
      });
      
      console.log('Registros restantes después de eliminar exitosos:', state.registros.length);
    },
    marcarRegistrosConErrores: (state, action) => {
      const { errores } = action.payload;
      console.log('Marcando registros con errores:', errores);
      
      // Marcar registros que fallaron con sus errores específicos
      errores.forEach(error => {
        const registro = state.registros.find(r => 
          r.item.id === error.itemId &&
          r.partida === error.partidaId &&
          r.rack === error.posicionInfo?.rack &&
          r.fila === error.posicionInfo?.fila &&
          r.nivel === error.posicionInfo?.nivel &&
          r.pasillo === error.posicionInfo?.pasillo
        );
        
        if (registro) {
          console.log('Marcando registro con error:', registro);
          registro.error = error.error;
          registro.tieneError = true;
          registro.stockDisponible = error.stockDisponible;
          registro.stockSolicitado = error.stockSolicitado;
        } else {
          console.log('No se encontró registro para marcar error:', error);
        }
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
  eliminarRegistrosExitosos,
  marcarRegistrosConErrores,
  setProveedoresSalida, 
  setClientesSalida,
  setItemsSalida, 
  setLoadingSalida, 
  setErrorSalida 
} = salidaSlice.actions;
export default salidaSlice.reducer;
