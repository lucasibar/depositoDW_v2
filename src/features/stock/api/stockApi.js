import { API_CONFIG } from '../../../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const stockApi = {
  // Obtener stock consolidado
  getStockConsolidado: async () => {
    try {
      console.log('🌐 stockApi: Haciendo petición a:', `${API_BASE_URL}/movimientos/stock-consolidado`);
      const response = await fetch(`${API_BASE_URL}/movimientos/stock-consolidado`);
      console.log('📡 stockApi: Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ stockApi: Error del servidor:', errorText);
        throw new Error(`Error al obtener stock consolidado: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ stockApi: Datos recibidos:', data);
      console.log('✅ stockApi: Cantidad de elementos:', data?.length);
      return data;
    } catch (error) {
      console.error('❌ stockApi: Error al obtener stock consolidado:', error);
      throw error;
    }
  },

  // Obtener composición por posición desde movimientos_consulta_rapida
  getConsultaRapidaAgrupado: async () => {
    try {
      console.log('🌐 stockApi: Haciendo petición a:', `${API_BASE_URL}/movimientos/consulta-rapida-agrupado`);
      const response = await fetch(`${API_BASE_URL}/movimientos/consulta-rapida-agrupado`);
      console.log('📡 stockApi: Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ stockApi: Error del servidor:', errorText);
        throw new Error(`Error al obtener consulta rápida agrupada: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ stockApi: Consulta rápida agrupada recibida:', Array.isArray(data) ? data.length : data);
      return data;
    } catch (error) {
      console.error('❌ stockApi: Error al obtener consulta rápida agrupada:', error);
      throw error;
    }
  },

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