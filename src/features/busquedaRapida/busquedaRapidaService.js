import { apiClient } from '../../config/api';

export const busquedaRapidaService = {
  // Obtener todos los proveedores
  obtenerProveedores: async () => {
    try {
      const response = await apiClient.get('/proveedores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },

  // Obtener items de un proveedor
  obtenerItemsPorProveedor: async (idProveedor) => {
    try {
      const response = await apiClient.get(`/proveedores/${idProveedor}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener items del proveedor:', error);
      throw error;
    }
  },

  // Obtener total de kilos de un item desde movimientos-consulta-rapida
  obtenerKilosItem: async (itemId) => {
    try {
      const response = await apiClient.get(`/movimientos/busqueda-rapida-kilos/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener kilos del item:', error);
      throw error;
    }
  }
};
