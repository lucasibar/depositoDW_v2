import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://derwill-deposito-backend.onrender.com';

export const presupuestoApi = {
  // Nota: Estas rutas no existen en el servidor actual
  // Se pueden implementar en el futuro
  
  // Obtener presupuestos (mock data por ahora)
  getPresupuesto: () => {
    // Mock data hasta que se implemente en el servidor
    return Promise.resolve({
      data: [
        {
          id: 1,
          numero: 'PRES-001',
          descripcion: 'Presupuesto Q1 2024',
          monto: 50000,
          fecha: '2024-01-01',
          estado: 'Activo'
        },
        {
          id: 2,
          numero: 'PRES-002',
          descripcion: 'Presupuesto Q2 2024',
          monto: 75000,
          fecha: '2024-04-01',
          estado: 'Pendiente'
        }
      ]
    });
  },
  
  // Crear presupuesto (mock)
  createPresupuesto: (presupuestoData) => {
    return Promise.resolve({
      data: {
        id: Date.now(),
        ...presupuestoData,
        estado: 'Pendiente'
      }
    });
  },
  
  // Actualizar presupuesto (mock)
  updatePresupuesto: (id, presupuestoData) => {
    return Promise.resolve({
      data: {
        id,
        ...presupuestoData
      }
    });
  },
  
  // Eliminar presupuesto (mock)
  deletePresupuesto: (id) => {
    return Promise.resolve({ success: true });
  },
}; 