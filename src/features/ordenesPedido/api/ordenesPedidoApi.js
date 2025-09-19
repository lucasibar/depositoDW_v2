import { API_CONFIG } from '../../../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

const BASE_URL = '/ordenes-pedido';

export const ordenesPedidoApi = {
  // Obtener todas las órdenes de pedido
  getOrdenes: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
    if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
    if (params.estado && params.estado !== 'todos') queryParams.append('estado', params.estado);
    if (params.proveedor) queryParams.append('proveedor', params.proveedor);
    if (params.numeroOrden) queryParams.append('numeroOrden', params.numeroOrden);
    if (params.pagina) queryParams.append('pagina', params.pagina);
    if (params.limite) queryParams.append('limite', params.limite);
    
    const url = queryParams.toString() ? `${API_BASE_URL}${BASE_URL}/listar?${queryParams}` : `${API_BASE_URL}${BASE_URL}/listar`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching órdenes de pedido");
    return { data: await response.json() };
  },

  // Obtener una orden de pedido por ID
  getOrdenById: async (id) => {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Error fetching orden de pedido");
    return { data: await response.json() };
  },

  // Crear una nueva orden de pedido
  createOrden: async (ordenData) => {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ordenData)
    });
    if (!response.ok) throw new Error("Error creating orden de pedido");
    return { data: await response.json() };
  },

  // Actualizar una orden de pedido
  updateOrden: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Error updating orden de pedido");
    return { data: await response.json() };
  },

  // Eliminar una orden de pedido
  deleteOrden: async (id) => {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error("Error deleting orden de pedido");
    return { data: { success: true } };
  },

  // Generar picking para una orden
  generarPicking: async (ordenId, pickingData) => {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${ordenId}/picking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pickingData)
    });
    if (!response.ok) throw new Error("Error generating picking");
    return { data: await response.json() };
  },

  // Obtener picking por fecha
  getPickingPorFecha: async (fecha) => {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/picking-por-fecha`);
    if (!response.ok) throw new Error("Error fetching picking por fecha");
    return { data: await response.json() };
  },

  // Obtener órdenes agrupadas
  getOrdenesAgrupadas: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
    if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
    if (params.pagina) queryParams.append('pagina', params.pagina);
    if (params.limite) queryParams.append('limite', params.limite);
    
    const url = queryParams.toString() ? `${API_BASE_URL}${BASE_URL}/agrupadas?${queryParams}` : `${API_BASE_URL}${BASE_URL}/agrupadas`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching órdenes agrupadas");
    return { data: await response.json() };
  },

  // Obtener estadísticas de órdenes (usando órdenes agrupadas)
  getEstadisticas: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
    if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
    
    const url = queryParams.toString() ? `${API_BASE_URL}${BASE_URL}/agrupadas?${queryParams}` : `${API_BASE_URL}${BASE_URL}/agrupadas`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching estadísticas");
    return { data: await response.json() };
  }
};
