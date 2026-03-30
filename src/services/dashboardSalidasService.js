import { apiClient } from '../config/api';

class DashboardSalidasService {
  async obtenerDashboard(fechaDesde, fechaHasta, clienteId = '') {
    try {
      const response = await apiClient.get('/dashboard-salidas', {
        params: { fechaDesde, fechaHasta, clienteId }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo dashboard de salidas:', error);
      throw error;
    }
  }

  async obtenerDesglose(fechaDesde, fechaHasta, clienteId = '') {
    try {
      const response = await apiClient.get('/dashboard-salidas/desglose', {
        params: { fechaDesde, fechaHasta, clienteId }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo desglose de salidas:', error);
      throw error;
    }
  }

  async obtenerClientes() {
    try {
      const response = await apiClient.get('/dashboard-salidas/clientes');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      throw error;
    }
  }

  async obtenerConfigs() {
    try {
      const response = await apiClient.get('/dashboard-salidas/configs');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo configuraciones:', error);
      throw error;
    }
  }

  async crearConfig(data) {
    try {
      const response = await apiClient.post('/dashboard-salidas/configs', data);
      return response.data;
    } catch (error) {
      console.error('Error creando configuración:', error);
      throw error;
    }
  }

  async actualizarConfig(id, data) {
    try {
      const response = await apiClient.put(`/dashboard-salidas/configs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      throw error;
    }
  }

  async eliminarConfig(id) {
    try {
      const response = await apiClient.delete(`/dashboard-salidas/configs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando configuración:', error);
      throw error;
    }
  }
}

export const dashboardSalidasService = new DashboardSalidasService();
