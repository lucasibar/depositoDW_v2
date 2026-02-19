import { apiClient } from '../config/api';

class DashboardComprasService {
  // Obtener el dashboard completo con stock calculado
  async obtenerDashboard() {
    try {
      const response = await apiClient.get('/dashboard-compras');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo dashboard:', error);
      throw error;
    }
  }

  // Obtener todas las configuraciones
  async obtenerConfiguraciones() {
    try {
      const response = await apiClient.get('/dashboard-compras/configuraciones');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo configuraciones:', error);
      throw error;
    }
  }

  // Obtener todos los proveedores
  async obtenerProveedores() {
    try {
      const response = await apiClient.get('/dashboard-compras/proveedores');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo proveedores:', error);
      throw error;
    }
  }

  // Obtener items por proveedor
  async obtenerItemsPorProveedor(proveedorId) {
    try {
      const response = await apiClient.get(`/dashboard-compras/proveedores/${proveedorId}/items`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo items por proveedor:', error);
      throw error;
    }
  }

  // Obtener detalles de items por IDs (Optimizado)
  async obtenerDetallesItems(itemIds) {
    try {
      if (!itemIds || itemIds.length === 0) return [];
      const response = await apiClient.post('/dashboard-compras/items-details', { itemIds });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo detalles de items:', error);
      throw error;
    }
  }

  // Actualizar configuración de una tarjeta
  async actualizarConfiguracion(tarjetaId, itemIds) {
    try {
      const response = await apiClient.put(`/dashboard-compras/configuraciones/${tarjetaId}`, {
        itemIds
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      throw error;
    }
  }

  // Crear nueva configuración
  async crearConfiguracion(nombreTarjeta, categoria, color, itemIds = []) {
    try {
      const response = await apiClient.post('/dashboard-compras/configuraciones', {
        nombreTarjeta,
        categoria,
        color,
        itemIds
      });
      return response.data;
    } catch (error) {
      console.error('Error creando configuración:', error);
      throw error;
    }
  }

  // Eliminar configuración
  async eliminarConfiguracion(tarjetaId) {
    try {
      const response = await apiClient.delete(`/dashboard-compras/configuraciones/${tarjetaId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando configuración:', error);
      throw error;
    }
  }

  // Obtener stock de una tarjeta específica
  async obtenerStockTarjeta(tarjetaId) {
    try {
      const response = await apiClient.get(`/dashboard-compras/stock/${tarjetaId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo stock de tarjeta:', error);
      throw error;
    }
  }

  // Descargar reporte de stock consolidado en Excel
  async descargarReporteStockExcel() {
    try {
      const response = await apiClient.get('/movimientos/reporte-stock-consulta-rapida');
      return response.data;
    } catch (error) {
      console.error('Error descargando reporte de stock:', error);
      throw error;
    }
  }
}

export const dashboardComprasService = new DashboardComprasService();
