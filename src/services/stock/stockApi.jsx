const API_BASE_URL = 'https://derwill-deposito-backend.onrender.com';


export const stockApi = {
   // Obtener todos los movimientos
  getAllMovimientos: async () => {
    try {
      console.log('🌐 stockApi: Haciendo petición a:', `${API_BASE_URL}/movimientos/all`);
      const response = await fetch(`${API_BASE_URL}/movimientos/all`);
      console.log('📡 stockApi: Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ stockApi: Error del servidor:', errorText);
        throw new Error(`Error al obtener todos los movimientos: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ stockApi: Datos de movimientos recibidos:', data);
      console.log('✅ stockApi: Cantidad de grupos de movimientos:', data?.length);
      return data;
    } catch (error) {
      console.error('❌ stockApi: Error al obtener todos los movimientos:', error);
      throw error;
    }
  },

}; 