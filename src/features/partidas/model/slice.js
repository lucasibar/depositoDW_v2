import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { partidasApi } from '../api/partidasApi';

export const fetchPartidasEnCuarentena = createAsyncThunk(
  'partidas/fetchPartidasEnCuarentena',
  async () => {
    return await partidasApi.getPartidasEnCuarentena();
  }
);

export const actualizarEstadoPartida = createAsyncThunk(
  'partidas/actualizarEstadoPartida',
  async ({ partidaId: id, nuevoEstado: estado }, { rejectWithValue }) => {
    try {
      console.log('Datos antes de enviar:', { id, estado });
      const response = await partidasApi.actualizarEstadoPartida(id, estado);
      console.log('Respuesta del servidor:', response);
      return { 
        partidaId: id, 
        nuevoEstado: estado 
      };
    } catch (error) {
      console.error('Error completo:', error.response || error);
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar el estado de la partida');
    }
  }
);

const initialState = {
  partidasEnCuarentena: [],
  partidasAprobadas: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const partidasSlice = createSlice({
  name: 'partidas',
  initialState,
  reducers: {
    marcarPartidaRevisada: (state, action) => {
      const partidaId = action.payload;
      const partida = state.partidasEnCuarentena.find(p => p.id === partidaId);
      if (partida) {
        partida.revisada = true;
        partida.fechaRevision = new Date().toISOString();
      }
    },
    
    actualizarPartidas: (state, action) => {
      const nuevasPartidas = action.payload.map(partida => ({
        ...partida,
        estado: partida.estado.toUpperCase(),
        fechaIngreso: new Date(partida.fechaIngreso).toLocaleDateString(),
        revisada: false
      }));
      state.partidasEnCuarentena = nuevasPartidas;
    },

    removePartida: (state, action) => {
      state.partidasEnCuarentena = state.partidasEnCuarentena.filter(partida => partida.id !== action.payload);
    },

    moverPartidaAStock: (state, action) => {
      const partidaId = action.payload;
      const partida = state.partidasEnCuarentena.find(p => p.id === partidaId);
      if (partida) {
        const partidaAprobada = { ...partida, estado: 'APROBADO' };
        state.partidasAprobadas.push(partidaAprobada);
        state.partidasEnCuarentena = state.partidasEnCuarentena.filter(p => p.id !== partidaId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartidasEnCuarentena.pending, (state) => {
        state.status = 'loading';
      })
             .addCase(fetchPartidasEnCuarentena.fulfilled, (state, action) => {
         state.status = 'succeeded';
         
         // Separar las partidas según su estado real
         const partidasFormateadas = action.payload.map(partida => {
           // Formatear la fecha
           const fechaOriginal = new Date(partida.fecha);
           const dia = fechaOriginal.getDate().toString().padStart(2, '0');
           const mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, '0');
           const año = fechaOriginal.getFullYear();
           const fechaFormateada = `${dia}-${mes}-${año}`;

           return {
             id: partida.id, 
             numeroPartida: partida.numeroPartida,
             item: partida.item,
             descripcionItem: partida.item ? `${partida.item.descripcion || ''} ${partida.item.categoria || ''}`.trim() || "Sin descripción" : "Sin descripción",
             kilos: partida.kilos,
             unidades: partida.unidades,
             estado: partida.estado,
             proveedor: partida.item?.proveedor?.nombre || "Sin proveedor",
             fecha: fechaFormateada,
             fechaModificacion: null,
             posicion: partida.posicion || "Sin posición"
           };
         });

         // Separar partidas según su estado
         state.partidasEnCuarentena = partidasFormateadas.filter(p => 
           p.estado === 'CUARENTENA' || p.estado === 'cuarentena'
         );
         
         state.partidasAprobadas = partidasFormateadas.filter(p => 
           p.estado === 'APROBADO' || p.estado === 'cuarentena-aprobada'
         );
       })
      .addCase(fetchPartidasEnCuarentena.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
             .addCase(actualizarEstadoPartida.fulfilled, (state, action) => {
         console.log('actualizarEstadoPartida.fulfilled:', action.payload);
         const { partidaId, nuevoEstado } = action.payload;
         
         // Buscar la partida en ambas listas
         let partidaEnCuarentena = state.partidasEnCuarentena.find(p => p.id === partidaId);
         let partidaEnAprobadas = state.partidasAprobadas.find(p => p.id === partidaId);
         
         if (partidaEnCuarentena) {
           // La partida está en cuarentena
           if (nuevoEstado.toLowerCase() === 'cuarentena-aprobada') {
             // Mover de cuarentena a aprobadas
             const partidaAprobada = { ...partidaEnCuarentena, estado: 'APROBADO' };
             state.partidasAprobadas.push(partidaAprobada);
             state.partidasEnCuarentena = state.partidasEnCuarentena.filter(p => p.id !== partidaId);
           }
         } else if (partidaEnAprobadas) {
           // La partida está en aprobadas
           if (nuevoEstado.toLowerCase() === 'rechazada') {
             // Remover de aprobadas (no se muestra en ninguna lista)
             state.partidasAprobadas = state.partidasAprobadas.filter(p => p.id !== partidaId);
           } else if (nuevoEstado.toLowerCase() === 'cuarentena') {
             // Mover de aprobadas a cuarentena
             const partidaDevuelta = { ...partidaEnAprobadas, estado: 'CUARENTENA' };
             state.partidasEnCuarentena.push(partidaDevuelta);
             state.partidasAprobadas = state.partidasAprobadas.filter(p => p.id !== partidaId);
           }
         }
       })
      .addCase(actualizarEstadoPartida.rejected, (state, action) => {
        state.error = 'Error al actualizar el estado de la partida';
      });
  }
});

export const { marcarPartidaRevisada, actualizarPartidas, removePartida, moverPartidaAStock } = partidasSlice.actions;
export default partidasSlice.reducer; 