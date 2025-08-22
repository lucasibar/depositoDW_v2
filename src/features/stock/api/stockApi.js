import { API_CONFIG } from '../../../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const stockApi = {
  // Obtener stock consolidado
  getStockConsolidado: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movimientos/stock-consolidado`);
      if (!response.ok) throw new Error('Error al obtener stock consolidado');
      return response.json();
    } catch (error) {
      console.error('Error al obtener stock consolidado:', error);
      throw error;
    }
  },

  // Ajustar material (restar cantidades)
  ajustarMaterial: async (ajusteData) => {
    try {
      console.log('🌐 Enviando petición POST a:', `${API_BASE_URL}/movimientos/ajuste-material`);
      console.log('📦 Datos enviados:', ajusteData);
      
      const response = await fetch(`${API_BASE_URL}/movimientos/ajuste-material`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ajusteData),
      });
      
      console.log('📡 Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al ajustar material');
      }
      
      const result = await response.json();
      console.log('✅ Respuesta exitosa:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al ajustar material:', error);
      throw error;
    }
  },

  // Buscar materiales por item ID
  buscarMaterialesPorItemId: async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movimientos/buscar-materiales/${itemId}`);
      if (!response.ok) throw new Error('Error al buscar materiales por item ID');
      return response.json();
    } catch (error) {
      console.error('Error al buscar materiales por item ID:', error);
      throw error;
    }
  }
}; 