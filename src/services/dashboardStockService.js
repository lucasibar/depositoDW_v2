import { apiClient } from '../config/api';

class DashboardStockService {
  async obtenerDashboard(proveedorId = '') {
    try {
      const response = await apiClient.get('/dashboard-stock', {
        params: { proveedorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo dashboard de stock:', error);
      throw error;
    }
  }

  async obtenerDesglose(proveedorId = '') {
    try {
      const response = await apiClient.get('/dashboard-stock/desglose', {
        params: { proveedorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo desglose de stock:', error);
      throw error;
    }
  }

  async obtenerProveedores() {
    try {
      const response = await apiClient.get('/dashboard-stock/proveedores');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo proveedores:', error);
      throw error;
    }
  }

  async obtenerConfigs() {
    try {
      const response = await apiClient.get('/dashboard-stock/configs');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo configuraciones de stock:', error);
      throw error;
    }
  }

  async crearConfig(data) {
    try {
      const response = await apiClient.post('/dashboard-stock/configs', data);
      return response.data;
    } catch (error) {
      console.error('Error creando configuración de stock:', error);
      throw error;
    }
  }

  async actualizarConfig(id, data) {
    try {
      const response = await apiClient.patch(`/dashboard-stock/configs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando configuración de stock:', error);
      throw error;
    }
  }

  async eliminarConfig(id) {
    try {
      const response = await apiClient.delete(`/dashboard-stock/configs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando configuración de stock:', error);
      throw error;
    }
  }
}

export const dashboardStockService = new DashboardStockService();
