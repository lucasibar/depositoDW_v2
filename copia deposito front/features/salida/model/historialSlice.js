import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

/** @type {import('./types').HistorialState} */
const initialState = {
  historialSalida: [],
  loading: false,
  error: null
};

// Función para convertir YYYY-MM-DD a DD-MM-YYYY (solo para visualización)
const convertirFecha = (fecha) => {
  const [year, month, day] = fecha.split('-');
  return `${day}-${month}-${year}`;
};

// Función auxiliar para ordenar por fecha
const sortByDate = (a, b) => {
  // Comparamos directamente las fechas en formato YYYY-MM-DD
  // Ordenamos de más reciente a más antiguo
  if (a.fecha > b.fecha) return -1;  // a es más reciente, va primero
  if (a.fecha < b.fecha) return 1;   // b es más reciente, va primero
  return 0; // son iguales
};

// Función para validar si una fecha es válida en formato YYYY-MM-DD
const esUnaFechaValida = (fecha) => {
  if (!fecha || typeof fecha !== 'string') return false;
  const [year, month, day] = fecha.split('-');
  const date = new Date(year, month - 1, day);
  return date instanceof Date && !isNaN(date) &&
    date.getFullYear() === parseInt(year) &&
    date.getMonth() === parseInt(month) - 1 &&
    date.getDate() === parseInt(day);
};

export const fetchHistorialSalida = createAsyncThunk(
  'historial/fetchHistorialSalida',
  async () => {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/movimientos/salida`);
    
    // Filtramos las fechas inválidas antes de ordenar
    const validData = response.data.filter(remito => esUnaFechaValida(remito.fecha));
    
    // Ordenamos los datos válidos
    const sortedData = validData.sort(sortByDate);
    
    // Luego convertimos el formato para visualización
    return sortedData.map(remito => ({
      ...remito,
      fechaOriginal: remito.fecha, // Mantenemos la fecha original para ordenamiento
      fecha: convertirFecha(remito.fecha) // Fecha formateada para visualización
    }));
  }
);

export const deleteItemFromRemito = createAsyncThunk(
  'historial/deleteItemFromRemito',
  async ({ remitoId, itemId }) => {
    const response = await axios.delete(`${API_CONFIG.BASE_URL}/movimientos/salida/${remitoId}/items/${itemId}`);
    return { remitoId, itemId };
  }
);

const historialSlice = createSlice({
  name: 'historial',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistorialSalida.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistorialSalida.fulfilled, (state, action) => {
        state.loading = false;
        state.historialSalida = action.payload;
      })
      .addCase(fetchHistorialSalida.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteItemFromRemito.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteItemFromRemito.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizar el estado local removiendo el item
        const { remitoId, itemId } = action.payload;
        const remitoIndex = state.historialSalida.findIndex(remito => remito.id === remitoId);
        
        if (remitoIndex !== -1) {
          state.historialSalida[remitoIndex].items = state.historialSalida[remitoIndex].items.filter(
            item => item.id !== itemId
          );
          
          // Si el remito no tiene más items, eliminarlo completamente
          if (state.historialSalida[remitoIndex].items.length === 0) {
            state.historialSalida.splice(remitoIndex, 1);
          }
        }
      })
      .addCase(deleteItemFromRemito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default historialSlice.reducer; 