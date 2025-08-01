import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

// Crear una instancia de axios configurada
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

export const comprasApi = {
  // Obtener todos los items
  getItems: () => apiClient.get('/items'),
  
  // Obtener items por proveedor
  getItemsByProveedor: (idProveedor) => apiClient.get(`/items/${idProveedor}`),
  
  // Crear nuevo item
  createItem: (itemData) => apiClient.post('/items', itemData),
  
  // Obtener todos los proveedores
  getProveedores: () => apiClient.get('/proveedores'),
  
  // Obtener items de un proveedor específico
  getItemsProveedor: (idProveedor) => apiClient.get(`/proveedores/${idProveedor}`),
  
  // Crear nuevo proveedor
  createProveedor: (proveedorData) => apiClient.post('/proveedores', proveedorData),
}; 