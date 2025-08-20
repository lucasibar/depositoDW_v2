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
      
      const response = await axios.post(`${API_CONFIG.BASE_URL}/posiciones/adicion_rapida`, {
        registros: registros
      });
      
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
