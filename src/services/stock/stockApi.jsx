const API_BASE_URL = 'https://derwill-deposito-backend.onrender.com';


export const stockApi = {
  // Obtener movimientos de consulta rápida consolidados
  getMovimientosConsultaRapida: async () => {
    const endpoint = `${API_BASE_URL}/movimientos/consulta-rapida-agrupado`;
    try {
      console.log('🌐 stockApi: Consultando movimientos consulta rápida en:', endpoint);
      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ stockApi: Error en consulta rápida:', errorText);
        throw new Error(
          `Error al obtener movimientos consulta rápida: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('✅ stockApi: Movimientos consulta rápida recibidos:', data?.length);
      console.log(data[0])
      return data;
    } catch (error) {
      console.error('❌ stockApi: Error al obtener movimientos consulta rápida:', error);
      throw error;
    }
  },

}; 