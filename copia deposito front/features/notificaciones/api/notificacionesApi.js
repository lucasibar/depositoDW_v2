import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

// Crear una instancia de axios configurada
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

export const notificacionesApi = {
  // Obtener todas las notificaciones
  getAll: () => apiClient.get('/notificaciones'),
  
  // Obtener notificaciones no leídas
  getUnread: () => apiClient.get('/notificaciones/unread'),
  
  // Obtener notificaciones por categoría
  getByCategoria: (categoria) => apiClient.get(`/notificaciones?categoria=${categoria}`),
  
  // Obtener estadísticas
  getStats: () => apiClient.get('/notificaciones/stats'),
  
  // Marcar como leída
  markAsRead: (id) => apiClient.put(`/notificaciones/${id}/read`),
  
  // Marcar todas como leídas
  markAllAsRead: () => apiClient.put('/notificaciones/read-all'),
  
  // Eliminar notificación
  delete: (id) => apiClient.delete(`/notificaciones/${id}`),
  
  // Eliminar todas las notificaciones
  deleteAll: () => apiClient.delete('/notificaciones'),
  
  // Eliminar notificaciones leídas
  deleteRead: () => apiClient.delete('/notificaciones/read'),
  
  // Crear notificación
  create: (data) => apiClient.post('/notificaciones', data),
};
