import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  setProveedoresSalida, 
  setClientesSalida, 
  setItemsSalida, 
  setLoadingSalida, 
  setErrorSalida 
} from './salidaSlice';
import { API_CONFIG } from '../../../config/api';

// Datos mock para desarrollo
const mockProveedores = [
  { id: 1, nombre: 'Cliente A', categoria: 'clientes' },
  { id: 2, nombre: 'Cliente B', categoria: 'clientes' },
  { id: 3, nombre: 'Proveedor C', categoria: 'proveedor' },
  { id: 4, nombre: 'Cliente D', categoria: 'clientes' },
  { id: 5, nombre: 'Proveedor E', categoria: 'proveedor' },
  { id: 6, nombre: 'Proveedor F', categoria: 'proveedor' },
  { id: 7, nombre: 'Cliente G', categoria: 'cliente' }, // Variante singular
  { id: 8, nombre: 'Cliente H', categoria: 'CLIENTES' }, // Mayúsculas
  { id: 9, nombre: 'Proveedor I', categoria: 'PROVEEDOR' }, // Mayúsculas
  { id: 10, nombre: 'Sin Categoría', categoria: null }, // Sin categoría
];

const mockItems = [
  { id: 1, descripcion: 'Item 1', categoria: 'Categoría A', proveedorId: 3 },
  { id: 2, descripcion: 'Item 2', categoria: 'Categoría B', proveedorId: 3 },
  { id: 3, descripcion: 'Item 3', categoria: 'Categoría A', proveedorId: 5 },
  { id: 4, descripcion: 'Item 4', categoria: 'Categoría C', proveedorId: 5 },
  { id: 5, descripcion: 'Item 5', categoria: 'Categoría D', proveedorId: 6 },
  { id: 6, descripcion: 'Item 6', categoria: 'Categoría E', proveedorId: 6 },
  { id: 7, descripcion: 'Item 7', categoria: 'Categoría F', proveedorId: 9 },
  { id: 8, descripcion: 'Item 8', categoria: 'Categoría G', proveedorId: 9 },
  // Agregar items sin proveedorId para testing
  { id: 9, descripcion: 'Item Sin Proveedor 1', categoria: 'Categoría X' },
  { id: 10, descripcion: 'Item Sin Proveedor 2', categoria: 'Categoría Y' },
];

// Thunk para cargar datos iniciales de salida
export const cargarDatosSalida = createAsyncThunk(
  'salida/cargarDatos',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoadingSalida(true));
      dispatch(setErrorSalida(null));

      let proveedores, items;

      try {
        // Intentar cargar desde la API
        const proveedoresResponse = await fetch(`${API_CONFIG.BASE_URL}/proveedores`);
        if (!proveedoresResponse.ok) {
          throw new Error(`Error al cargar proveedores: ${proveedoresResponse.status}`);
        }
        proveedores = await proveedoresResponse.json();

        const itemsResponse = await fetch(`${API_CONFIG.BASE_URL}/items`);
        if (!itemsResponse.ok) {
          throw new Error(`Error al cargar items: ${itemsResponse.status}`);
        }
        items = await itemsResponse.json();
      } catch (apiError) {
        console.warn('Error al cargar desde API, usando datos mock:', apiError);
        // Usar datos mock si la API falla
        proveedores = mockProveedores;
        items = mockItems;
      }

      // Debug: mostrar todos los proveedores
      console.log('Todos los proveedores cargados:', proveedores);

      // Función helper para verificar si es cliente
      const esCliente = (proveedor) => {
        if (!proveedor.categoria) return false;
        const categoria = proveedor.categoria.toLowerCase().trim();
        return categoria === 'clientes' || categoria === 'cliente';
      };

      // Filtrar clientes (proveedores con categoría "clientes")
      const clientes = proveedores.filter(proveedor => {
        const esClienteResult = esCliente(proveedor);
        if (esClienteResult) {
          console.log('Cliente encontrado:', proveedor);
        }
        return esClienteResult;
      });

      // Filtrar proveedores (excluyendo clientes)
      const proveedoresFiltrados = proveedores.filter(proveedor => {
        return !esCliente(proveedor);
      });

      console.log('Clientes filtrados:', clientes);
      console.log('Proveedores filtrados:', proveedoresFiltrados);

             console.log('=== DATOS FINALES PARA EL ESTADO ===');
       console.log('Proveedores filtrados (sin clientes):', proveedoresFiltrados);
       console.log('Clientes filtrados:', clientes);
       console.log('Items cargados:', items);
       
       dispatch(setProveedoresSalida(proveedoresFiltrados));
       dispatch(setClientesSalida(clientes));
       dispatch(setItemsSalida(items));
       
       return { proveedores, clientes, items };
    } catch (error) {
      console.error('Error en cargarDatosSalida:', error);
      const errorMessage = error.message || 'Error desconocido al cargar datos';
      dispatch(setErrorSalida(errorMessage));
      throw error;
    } finally {
      dispatch(setLoadingSalida(false));
    }
  }
);

// Thunk para enviar registros de salida
export const enviarRegistrosSalida = createAsyncThunk(
  'salida/enviarRegistros',
  async (registros, { dispatch }) => {
    try {
      dispatch(setLoadingSalida(true));
      dispatch(setErrorSalida(null));

      // Preparar los datos para el backend
      const datosParaEnviar = {
        registros: registros.map(registro => ({
          cliente: registro.cliente,
          proveedor: registro.proveedor,
          item: registro.item,
          partida: registro.partida,
          kilos: parseFloat(registro.kilos) || 0,
          unidades: parseInt(registro.unidades) || 0,
          posicion: {
            rack: registro.rack,
            fila: registro.fila,
            nivel: registro.nivel,
            pasillo: registro.pasillo
          }
        }))
      };

      console.log('Enviando datos al backend:', datosParaEnviar);

      try {
        // Intentar enviar a la API
        const response = await fetch(`${API_CONFIG.BASE_URL}/salidas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosParaEnviar),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Error al enviar registros de salida: ${response.status}`);
        }

        const result = await response.json();
        console.log('Respuesta del backend:', result);
        return result;
      } catch (apiError) {
        console.warn('Error al enviar a API, simulando éxito:', apiError);
        // Simular éxito si la API falla
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
        return { 
          success: true, 
          message: 'Registros procesados correctamente (modo simulación)',
          registrosProcesados: datosParaEnviar.registros.length
        };
      }
    } catch (error) {
      console.error('Error en enviarRegistrosSalida:', error);
      dispatch(setErrorSalida(error.message));
      throw error;
    } finally {
      dispatch(setLoadingSalida(false));
    }
  }
);
