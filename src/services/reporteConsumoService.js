import { apiClient } from '../config/api';

/**
 * Servicio para obtener datos de consumo desde movimientos
 */
export const reporteConsumoService = {
  /**
   * Obtiene todos los remitos de salida en un rango de fechas
   * @param {string} fechaDesde - Fecha desde (formato YYYY-MM-DD)
   * @param {string} fechaHasta - Fecha hasta (formato YYYY-MM-DD)
   * @returns {Promise<Array>} Lista de remitos de salida con sus items
   */
  async obtenerRemitosSalidaPorFecha(fechaDesde, fechaHasta) {
    try {
      const response = await apiClient.get('/movimientos/remitos-salida-por-fecha', {
        params: {
          fechaDesde,
          fechaHasta
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener remitos de salida por fecha:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los datos de consumo');
    }
  },

  /**
   * Obtiene la lista única de materiales de los remitos de salida
   * @param {string} fechaDesde - Fecha desde (formato YYYY-MM-DD)
   * @param {string} fechaHasta - Fecha hasta (formato YYYY-MM-DD)
   * @returns {Promise<Array>} Lista de materiales únicos
   */
  async obtenerMaterialesUnicos(fechaDesde, fechaHasta) {
    try {
      const response = await apiClient.get('/movimientos/materiales-unicos-consumo', {
        params: {
          fechaDesde,
          fechaHasta
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener materiales únicos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los materiales');
    }
  },

  /**
   * Obtiene datos de consumo agrupados por fecha y material
   * @param {string} fechaDesde - Fecha desde (formato YYYY-MM-DD)
   * @param {string} fechaHasta - Fecha hasta (formato YYYY-MM-DD)
   * @param {Array} materialesSeleccionados - Array de IDs de materiales seleccionados
   * @param {boolean} unificar - Si true, suma todos los materiales en una sola línea
   * @returns {Promise<Array>} Datos para el gráfico
   */
  async obtenerDatosConsumo(fechaDesde, fechaHasta, materialesSeleccionados = [], unificar = false) {
    try {
      const response = await apiClient.post('/movimientos/datos-consumo-grafico', {
        fechaDesde,
        fechaHasta,
        materialesSeleccionados,
        unificar
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos de consumo:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los datos del gráfico');
    }
  }
};
