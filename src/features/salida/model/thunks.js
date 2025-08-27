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
      
      // Función helper para verificar si es cliente
      const esCliente = (proveedor) => {
        if (!proveedor.categoria) return false;
        const categoria = proveedor.categoria.toLowerCase().trim();
        return categoria === 'clientes' || categoria === 'cliente';
      };

      // Filtrar clientes (proveedores con categoría "clientes")
      const clientes = response.data.proveedores.filter(proveedor => {
        const esClienteResult = esCliente(proveedor);
        return esClienteResult;
      });

      // Filtrar proveedores (excluyendo clientes)
      const proveedoresFiltrados = response.data.proveedores.filter(proveedor => {
        return !esCliente(proveedor);
      });
      
      dispatch(setProveedoresSalida(proveedoresFiltrados));
      dispatch(setClientesSalida(clientes));
      dispatch(setItemsSalida(response.data.items));
      
      return { proveedores: response.data.proveedores, clientes, items: response.data.items };
    } catch (error) {
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

      // Generar un solo número de remito para todo el lote
      const numeroRemitoUnico = `RS-${Date.now()}`;
      
      // Preparar los datos para el backend usando la estructura específica de generar remito salida
      const datosParaEnviar = {
        fecha: registros[0]?.fecha || new Date().toISOString().split('T')[0], // Usar fecha del primer registro o fecha actual
        items: registros.map(registro => ({
          itemId: registro.item.id,
          partidaId: registro.partida,
          // Enviar campos de posición separados
          rack: registro.rack ? parseInt(registro.rack) : undefined,
          fila: registro.fila ? parseInt(registro.fila) : undefined,
          nivel: registro.nivel || undefined,
          pasillo: registro.pasillo ? parseInt(registro.pasillo) : undefined,
          clienteId: registro.cliente.id, // ID del cliente seleccionado
          proveedorId: registro.proveedor.id, // ID del proveedor del item (para filtrado)
          numeroRemito: numeroRemitoUnico, // Mismo número de remito para todos los registros del lote
          kilos: parseFloat(registro.kilos) || 0,
          unidades: parseInt(registro.unidades) || 0
        }))
      };

      console.log('📅 Fecha que se envía al backend:', datosParaEnviar.fecha);
      console.log('📦 Datos completos que se envían:', JSON.stringify(datosParaEnviar, null, 2));

      const response = await axios.post(`${API_CONFIG.BASE_URL}/movimientos/generar-remito-salida`, datosParaEnviar);

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al enviar los registros';
      dispatch(setErrorSalida(errorMessage));
      throw error;
    } finally {
      dispatch(setLoadingSalida(false));
    }
  }
);
