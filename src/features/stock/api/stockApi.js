import { apiClient } from '../../../config/api';

export const stockApi = {
  // Obtener stock total de un item
  getStockTotal: (idItem) => apiClient.get(`/stock/total/${idItem}`),
  
  // Obtener stock detallado de un item
  getStockByItem: (idItem) => apiClient.get(`/stock/${idItem}`),
  
  // Obtener stock por posición
  getStockByPosition: (dataPosicion) => apiClient.post(`/stock/posicion`, dataPosicion),
  
  // Obtener todos los movimientos de entrada (para stock general)
  getAllMovimientos: () => apiClient.get(`/movimientos/entrada`),
  
  // Obtener stock consolidado por item y partida
  getStockConsolidado: () => apiClient.get('/movimientos/stock-consolidado'),
  
  // Obtener posiciones con sus items
  getPosicionesConItems: () => apiClient.get(`/posiciones/items`),
  
  // Obtener movimientos de salida
  getMovimientosSalida: () => apiClient.get(`/movimientos/salida`),
  
  // Obtener salidas sin remito asignado
  getSalidasSinRemito: () => apiClient.get(`/movimientos/sin-remito`),
  
  // Adición rápida
  adicionRapida: (data) => apiClient.post(`/movimientos/adicion-rapida`, data),
  
  // Ajuste de stock (eliminación)
  ajusteStock: (data) => apiClient.post(`/movimientos/ajuste-stock`, data),
  
  // Movimiento interno
  movimientoInterno: (data) => apiClient.post(`/movimientos/interno`, data),
  
  // Corrección de item
  correccionItem: (data) => apiClient.put(`/movimientos/correccion/${data.posicionId}/${data.itemId}`, {
    kilos: data.kilos,
    unidades: data.unidades
  }),
}; 