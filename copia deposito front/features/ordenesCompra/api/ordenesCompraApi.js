import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://derwill-deposito-backend.onrender.com';

export const ordenesCompraApi = {
  // Nota: Estas rutas no existen en el servidor actual
  // Se pueden implementar en el futuro
  
  // Obtener órdenes de compra (mock data por ahora)
  getOrdenesCompra: () => {
    // Mock data hasta que se implemente en el servidor
    return Promise.resolve({
      data: [
        {
          id: 1,
          numero: 'OC-001',
          proveedor: 'Proveedor A',
          fecha: '2024-01-15',
          estado: 'Pendiente',
          items: []
        }
      ]
    });
  },
  
  // Crear orden de compra (mock)
  createOrdenCompra: (ordenData) => {
    return Promise.resolve({
      data: {
        id: Date.now(),
        ...ordenData,
        estado: 'Pendiente'
      }
    });
  },
  
  // Actualizar orden de compra (mock)
  updateOrdenCompra: (id, ordenData) => {
    return Promise.resolve({
      data: {
        id,
        ...ordenData
      }
    });
  },
  
  // Eliminar orden de compra (mock)
  deleteOrdenCompra: (id) => {
    return Promise.resolve({ success: true });
  },
}; 