import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

// Crear una instancia de axios configurada
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

export const partidasApi = {
  getPartidasEnCuarentena: async () => {
    const response = await apiClient.get('/partidas/cuarentena');
    return response.data;
  },

  actualizarEstadoPartida: async (id, estado) => {
    const response = await apiClient.put('/partidas/estado-partida', {
      id: id.toString(),
      estado: estado.toLowerCase()
    });
    return response.data;
  }
}; 