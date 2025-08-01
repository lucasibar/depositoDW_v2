import axios from 'axios';

const URL = "https://derwill-deposito-backend.onrender.com";

export const partidasApi = {
  getPartidasEnCuarentena: async () => {
    const response = await axios.get(`${URL}/partidas/cuarentena`);
    return response.data;
  },

  actualizarEstadoPartida: async (id, estado) => {
    console.log('Enviando al servidor:', { id, estado });
    const response = await axios.put(`${URL}/partidas/estado-partida`, {
      id: id.toString(),
      estado: estado.toLowerCase()
    });
    return response.data;
  }
}; 