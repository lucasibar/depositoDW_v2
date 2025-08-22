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
      console.log('Registros antes de eliminar:', state.registros.length);
      
      // Eliminar registros que se procesaron exitosamente
      state.registros = state.registros.filter(registro => {
        console.log('🔍 Evaluando registro:', {
          registroItemId: registro.item?.id,
          registroPartida: registro.partida,
          registroRack: registro.rack,
          registroFila: registro.fila,
          registroNivel: registro.nivel,
          registroPasillo: registro.pasillo
        });
        
        const esExitoso = exitosos.some(exitoso => {
          console.log('🔍 Comparando con exitoso:', {
            exitosoItemId: exitoso.itemId,
            exitosoPartidaId: exitoso.partidaId,
            exitosoPosicionId: exitoso.posicionId,
            exitosoPosicionInfo: exitoso.posicionInfo
          });
          
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
          
          console.log('🔍 Resultados de comparación exitoso:', {
            itemMatch,
            partidaMatch,
            posicionMatch,
            esExitoso: itemMatch && partidaMatch && posicionMatch
          });
          
          return itemMatch && partidaMatch && posicionMatch;
        });
        
        if (esExitoso) {
          console.log('✅ Eliminando registro exitoso:', registro);
        } else {
          console.log('❌ Manteniendo registro (no exitoso):', registro);
        }
        
        return !esExitoso; // Mantener solo los que NO fueron exitosos
      });
      
      console.log('Registros restantes después de eliminar exitosos:', state.registros.length);
    },
    marcarRegistrosConErrores: (state, action) => {
      const { errores } = action.payload;
      console.log('Marcando registros con errores:', errores);
      console.log('Registros actuales en el estado:', state.registros);
      console.log('Estructura detallada de registros:', state.registros.map(r => ({
        itemId: r.item?.id,
        partida: r.partida,
        rack: r.rack,
        fila: r.fila,
        nivel: r.nivel,
        pasillo: r.pasillo,
        rackType: typeof r.rack,
        filaType: typeof r.fila,
        pasilloType: typeof r.pasillo
      })));
      
      // Marcar registros que fallaron con sus errores específicos
      errores.forEach(error => {
        console.log('🔍 Buscando registro para error:', {
          errorItemId: error.itemId,
          errorPartidaId: error.partidaId,
          errorPosicionInfo: error.posicionInfo
        });
        
        const registro = state.registros.find(r => {
          console.log('🔍 Comparando con registro:', {
            registroItemId: r.item?.id,
            registroPartida: r.partida,
            registroRack: r.rack,
            registroFila: r.fila,
            registroNivel: r.nivel,
            registroPasillo: r.pasillo
          });
          
          const itemMatch = r.item?.id === error.itemId;
          const partidaMatch = r.partida === error.partidaId;
                     const rackMatch = Number(r.rack) === error.posicionInfo?.rack;
           const filaMatch = Number(r.fila) === error.posicionInfo?.fila;
           const nivelMatch = String(r.nivel) === String(error.posicionInfo?.nivel);
           const pasilloMatch = ((error.posicionInfo?.pasillo && r.pasillo && Number(r.pasillo) === error.posicionInfo.pasillo) ||
                                (!error.posicionInfo?.pasillo && !r.pasillo));
          
          console.log('🔍 Resultados de comparación:', {
            itemMatch,
            partidaMatch,
            rackMatch,
            filaMatch,
            nivelMatch,
            pasilloMatch
          });
          
          return itemMatch && partidaMatch && rackMatch && filaMatch && nivelMatch && pasilloMatch;
        });
        
        if (registro) {
          console.log('✅ Marcando registro con error:', registro);
          registro.error = error.error;
          registro.tieneError = true;
          registro.stockDisponible = error.stockDisponible;
          registro.stockSolicitado = error.stockSolicitado;
        } else {
          console.log('❌ No se encontró registro para marcar error:', error);
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
