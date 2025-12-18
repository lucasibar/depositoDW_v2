const API_BASE_URL = 'https://derwill-deposito-backend.onrender.com';


export const stockApi = {
  // Obtener movimientos de consulta rápida consolidados
  getMovimientosConsultaRapida: async () => {
    const endpoint = `${API_BASE_URL}/movimientos/consulta-rapida-agrupado`;
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al obtener movimientos consulta rápida: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

}; 
