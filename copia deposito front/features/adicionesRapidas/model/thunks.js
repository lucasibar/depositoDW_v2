import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../../config/api';
import { setProveedores, setItems, setLoading, setError } from './slice';

export const cargarDatosIniciales = createAsyncThunk(
  'adicionesRapidas/cargarDatosIniciales',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await axios.get(`${API_CONFIG.BASE_URL}/remitos/dataload-remito-recepcion`);
      dispatch(setProveedores(response.data.proveedores));
      dispatch(setItems(response.data.items));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los datos';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const enviarAdicionRapida = createAsyncThunk(
  'adicionesRapidas/enviarAdicionRapida',
  async (registros, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      // Simplificar los datos enviados - solo itemId y datos esenciales
      const registrosSimplificados = registros.map(registro => ({
        itemId: registro.itemId,
        partida: registro.partida, // Solo el número de partida
        kilos: registro.kilos,
        unidades: registro.unidades,
        // Datos de posición para encontrarla
        rack: registro.rack,
        fila: registro.fila,
        nivel: registro.nivel,
        pasillo: registro.pasillo
      }));
      
      const datosParaEnviar = {
        registros: registrosSimplificados
      };
      
      console.log('📦 JSON enviado en adición rápida:', JSON.stringify(datosParaEnviar, null, 2));
      
      const response = await axios.post(`${API_CONFIG.BASE_URL}/posiciones/adicion_rapida`, datosParaEnviar);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al enviar los registros';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const buscarMaterialesPorProveedorItem = createAsyncThunk(
  'adicionesRapidas/buscarMaterialesPorProveedorItem',
  async (params, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await axios.get(`${API_CONFIG.BASE_URL}/posiciones/buscar-materiales`, {
        params: {
          proveedor: params.proveedor,
          item: params.item
        }
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al buscar materiales';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const buscarMaterialesPorItemId = createAsyncThunk(
  'adicionesRapidas/buscarMaterialesPorItemId',
  async (params, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await axios.get(`${API_CONFIG.BASE_URL}/posiciones/buscar-materiales-por-item`, {
        params: {
          itemId: params.itemId
        }
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al buscar materiales';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const buscarItemsPorPosicion = createAsyncThunk(
  'adicionesRapidas/buscarItemsPorPosicion',
  async (params, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      // Usar el nuevo endpoint que devuelve movimientos agrupados por partida
      const response = await axios.get(`${API_CONFIG.BASE_URL}/movimientos/consulta-posicion`, {
        params: params
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al buscar items por posición';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
