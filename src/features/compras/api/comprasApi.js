import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

export const comprasApi = {
  // Obtener todos los items
  getItems: () => axios.get(`${API_CONFIG.BASE_URL}/items`),
  
  // Obtener items por proveedor
  getItemsByProveedor: (idProveedor) => axios.get(`${API_CONFIG.BASE_URL}/items/${idProveedor}`),
  
  // Crear nuevo item
  createItem: (itemData) => axios.post(`${API_CONFIG.BASE_URL}/items`, itemData),
  
  // Obtener todos los proveedores
  getProveedores: () => axios.get(`${API_CONFIG.BASE_URL}/proveedores`),
  
  // Obtener items de un proveedor específico
  getItemsProveedor: (idProveedor) => axios.get(`${API_CONFIG.BASE_URL}/proveedores/${idProveedor}`),
  
  // Crear nuevo proveedor
  createProveedor: (proveedorData) => axios.post(`${API_CONFIG.BASE_URL}/proveedores`, proveedorData),
}; 