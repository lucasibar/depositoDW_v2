import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

export const remitosApi = {
  // Obtener datos de remitos de recepción
  getDataRemitoRecepcion: () => axios.get(`${API_CONFIG.BASE_URL}/remitos/dataload-remito-recepcion`),
  
  // Obtener remitos de entrada
  getRemitosEntrada: () => axios.get(`${API_CONFIG.BASE_URL}/movimientos/entrada`),
  
  // Obtener remitos de entrada agrupados
  getRemitosEntradaAgrupados: () => axios.get(`${API_CONFIG.BASE_URL}/movimientos/remitos-entrada`),
  
  // Eliminar movimiento de remito
  deleteMovimientoRemito: (id) => axios.delete(`${API_CONFIG.BASE_URL}/movimientos/movimiento/${id}`),
  
  // Crear remito de entrada
  createRemitoEntrada: (remitoData) => axios.post(`${API_CONFIG.BASE_URL}/movimientos/remito-entrada`, remitoData),
  
  // Crear remito de salida
  createRemitoSalida: (remitoData) => axios.post(`${API_CONFIG.BASE_URL}/movimientos/generarRemitoSalida`, remitoData),
  
  // Obtener salidas sin remito asignado
  getSalidasSinRemito: () => axios.get(`${API_CONFIG.BASE_URL}/movimientos/sin-remito`),
}; 