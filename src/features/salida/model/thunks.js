import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  setProveedoresSalida, 
  setClientesSalida, 
  setItemsSalida, 
  setLoadingSalida, 
  setErrorSalida 
} from './salidaSlice';
import { API_CONFIG } from '../../../config/api';

// Thunk para cargar datos iniciales de salida (usando la misma ruta que adición rápida)
export const cargarDatosSalida = createAsyncThunk(
  'salida/cargarDatos',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoadingSalida(true));
      dispatch(setErrorSalida(null));
      
      const response = await axios.get(`${API_CONFIG.BASE_URL}/remitos/dataload-remito-recepcion`);
      
      // Debug: mostrar todos los proveedores
      console.log('Todos los proveedores cargados:', response.data.proveedores);

      // Función helper para verificar si es cliente
      const esCliente = (proveedor) => {
        if (!proveedor.categoria) return false;
        const categoria = proveedor.categoria.toLowerCase().trim();
        return categoria === 'clientes' || categoria === 'cliente';
      };

      // Filtrar clientes (proveedores con categoría "clientes")
      const clientes = response.data.proveedores.filter(proveedor => {
        const esClienteResult = esCliente(proveedor);
        if (esClienteResult) {
          console.log('Cliente encontrado:', proveedor);
        }
        return esClienteResult;
      });

      // Filtrar proveedores (excluyendo clientes)
      const proveedoresFiltrados = response.data.proveedores.filter(proveedor => {
        return !esCliente(proveedor);
      });

      console.log('Clientes filtrados:', clientes);
      console.log('Proveedores filtrados:', proveedoresFiltrados);

      console.log('=== DATOS FINALES PARA EL ESTADO ===');
      console.log('Proveedores filtrados (sin clientes):', proveedoresFiltrados);
      console.log('Clientes filtrados:', clientes);
      console.log('Items cargados:', response.data.items);
      
      dispatch(setProveedoresSalida(proveedoresFiltrados));
      dispatch(setClientesSalida(clientes));
      dispatch(setItemsSalida(response.data.items));
      
      return { proveedores: response.data.proveedores, clientes, items: response.data.items };
    } catch (error) {
      console.error('Error en cargarDatosSalida:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al cargar datos';
      dispatch(setErrorSalida(errorMessage));
      throw error;
    } finally {
      dispatch(setLoadingSalida(false));
    }
  }
);

// Thunk para enviar registros de salida (usando la ruta específica de generar remito salida)
export const enviarRegistrosSalida = createAsyncThunk(
  'salida/enviarRegistros',
  async (registros, { dispatch }) => {
    try {
      dispatch(setLoadingSalida(true));
      dispatch(setErrorSalida(null));

      // Preparar los datos para el backend usando la estructura específica de generar remito salida
      const datosParaEnviar = {
        items: registros.map(registro => ({
          itemId: registro.item.id,
          partidaId: registro.partida,
          // Enviar campos de posición separados
          rack: registro.rack ? parseInt(registro.rack) : undefined,
          fila: registro.fila ? parseInt(registro.fila) : undefined,
          nivel: registro.nivel || undefined,
          pasillo: registro.pasillo ? parseInt(registro.pasillo) : undefined,
          proveedorId: registro.proveedor.id,
          fecha: new Date().toISOString().split('T')[0], // Fecha actual
          numeroRemito: `RS-${Date.now()}`, // Número de remito generado automáticamente
          kilos: parseFloat(registro.kilos) || 0,
          unidades: parseInt(registro.unidades) || 0
        }))
      };

      console.log('Enviando datos al backend para salida:', datosParaEnviar);

      const response = await axios.post(`${API_CONFIG.BASE_URL}/movimientos/generar-remito-salida`, datosParaEnviar);

      console.log('Respuesta del backend:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error en enviarRegistrosSalida:', error);
      const errorMessage = error.response?.data?.message || 'Error al enviar los registros';
      dispatch(setErrorSalida(errorMessage));
      throw error;
    } finally {
      dispatch(setLoadingSalida(false));
    }
  }
);
