import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

export const stockApi = {
  // Obtener stock total de un item
  getStockTotal: (idItem) => axios.get(`${API_CONFIG.BASE_URL}/stock/total/${idItem}`),
  
  // Obtener stock detallado de un item
  getStockByItem: (idItem) => axios.get(`${API_CONFIG.BASE_URL}/stock/${idItem}`),
  
  // Obtener stock por posición
  getStockByPosition: (dataPosicion) => axios.post(`${API_CONFIG.BASE_URL}/stock/posicion`, dataPosicion),
  
  // Obtener todos los movimientos de entrada (para stock general)
  getAllMovimientos: () => axios.get(`${API_CONFIG.BASE_URL}/movimientos/entrada`),
  
  // Obtener stock consolidado por item y partida
  getStockConsolidado: () => axios.get(`${API_CONFIG.BASE_URL}/movimientos/stock-consolidado`),
  
  // Obtener posiciones con sus items
  getPosicionesConItems: () => axios.get(`${API_CONFIG.BASE_URL}/posiciones/items`),
  
  // Obtener movimientos de salida
  getMovimientosSalida: () => axios.get(`${API_CONFIG.BASE_URL}/movimientos/salida`),
  
  // Obtener salidas sin remito asignado
  getSalidasSinRemito: () => axios.get(`${API_CONFIG.BASE_URL}/movimientos/sin-remito`),
  
  // Adición rápida
  adicionRapida: (data) => axios.post(`${API_CONFIG.BASE_URL}/movimientos/adicion-rapida`, data),
  
  // Movimiento interno
  movimientoInterno: (data) => axios.post(`${API_CONFIG.BASE_URL}/movimientos/interno`, data),
  
  // Corrección de item
  correccionItem: (data) => axios.put(`${API_CONFIG.BASE_URL}/movimientos/correccion/${data.posicionId}/${data.itemId}`, data),
}; 