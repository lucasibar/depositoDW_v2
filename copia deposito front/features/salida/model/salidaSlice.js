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
      state.registros.push(action.payload);
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
      
      // Eliminar registros que se procesaron exitosamente
      state.registros = state.registros.filter(registro => {
        const esExitoso = exitosos.some(exitoso => {
          const itemMatch = exitoso.itemId === registro.item.id;
          const partidaMatch = exitoso.partidaId === registro.partida;
          
          // Comparar posición usando solo los campos individuales ya que no tenemos posicionId en el frontend
          const posicionMatch = (exitoso.posicionInfo && 
            Number(exitoso.posicionInfo.rack) === Number(registro.rack) &&
            Number(exitoso.posicionInfo.fila) === Number(registro.fila) &&
            String(exitoso.posicionInfo.nivel) === String(registro.nivel) &&
            // Solo comparar pasillo si ambos tienen valor, o si ambos están vacíos
            ((exitoso.posicionInfo.pasillo && registro.pasillo && Number(exitoso.posicionInfo.pasillo) === Number(registro.pasillo)) ||
             (!exitoso.posicionInfo.pasillo && !registro.pasillo)));
          
          return itemMatch && partidaMatch && posicionMatch;
        });
        
        return !esExitoso; // Mantener solo los que NO fueron exitosos
      });
    },
    marcarRegistrosConErrores: (state, action) => {
      const { errores } = action.payload;
      
      // Marcar registros que fallaron con sus errores específicos
      errores.forEach(error => {
        const registro = state.registros.find(r => {
          const itemMatch = r.item?.id === error.itemId;
          const partidaMatch = r.partida === error.partidaId;
          const rackMatch = Number(r.rack) === error.posicionInfo?.rack;
          const filaMatch = Number(r.fila) === error.posicionInfo?.fila;
          const nivelMatch = String(r.nivel) === String(error.posicionInfo?.nivel);
          const pasilloMatch = ((error.posicionInfo?.pasillo && r.pasillo && Number(r.pasillo) === error.posicionInfo.pasillo) ||
                               (!error.posicionInfo?.pasillo && !r.pasillo));
          
          return itemMatch && partidaMatch && rackMatch && filaMatch && nivelMatch && pasilloMatch;
        });
        
        if (registro) {
          registro.error = error.error;
          registro.tieneError = true;
          registro.stockDisponible = error.stockDisponible;
          registro.stockSolicitado = error.stockSolicitado;
        }
      });
    },
    setProveedoresSalida: (state, action) => {
      state.proveedores = action.payload;
    },
    setClientesSalida: (state, action) => {
      state.clientes = action.payload;
    },
    setItemsSalida: (state, action) => {
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
