import { optimizedApiClient } from '../../../services/optimizedApiClient';

export const stockApi = {
  // Obtener stock total de un item
  getStockTotal: (idItem) => optimizedApiClient.get(`/stock/total/${idItem}`),
  
  // Obtener stock detallado de un item
  getStockByItem: (idItem) => optimizedApiClient.get(`/stock/${idItem}`),
  
  // Obtener stock por posición
  getStockByPosition: (dataPosicion) => optimizedApiClient.post(`/stock/posicion`, dataPosicion),
  
  // Obtener todos los movimientos de entrada (para stock general)
  getAllMovimientos: () => optimizedApiClient.get(`/movimientos/entrada`),
  
  // Obtener stock consolidado por item y partida
  getStockConsolidado: () => optimizedApiClient.get('/movimientos/stock-consolidado'),
  
  // Obtener posiciones con sus items
  getPosicionesConItems: () => optimizedApiClient.get(`/posiciones/items`),
  
  // Obtener movimientos de salida
  getMovimientosSalida: () => optimizedApiClient.get(`/movimientos/salida`),
  
  // Obtener salidas sin remito asignado
  getSalidasSinRemito: () => optimizedApiClient.get(`/movimientos/sin-remito`),
  
  // Adición rápida
  adicionRapida: (data) => optimizedApiClient.post(`/movimientos/adicion-rapida`, data),
  
  // Ajuste de stock (eliminación)
  ajusteStock: (data) => optimizedApiClient.post(`/movimientos/ajuste-stock`, data),
  
  // Movimiento interno
  movimientoInterno: (data) => optimizedApiClient.post(`/movimientos/interno`, data),
  
  // Corrección de item
  correccionItem: (data) => optimizedApiClient.put(`/movimientos/correccion/${data.posicionId}/${data.itemId}`, {
    kilos: data.kilos,
    unidades: data.unidades
  }),
}; 