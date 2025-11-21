import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { comprasApi } from '../api/comprasApi';

// Async thunks
export const fetchItems = createAsyncThunk(
  'compras/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await comprasApi.getItems();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar items');
    }
  }
);

export const fetchProveedores = createAsyncThunk(
  'compras/fetchProveedores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await comprasApi.getProveedores();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proveedores');
    }
  }
);

export const createItem = createAsyncThunk(
  'compras/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await comprasApi.createItem(itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear item');
    }
  }
);

export const createProveedor = createAsyncThunk(
  'compras/createProveedor',
  async (proveedorData, { rejectWithValue }) => {
    try {
      const response = await comprasApi.createProveedor(proveedorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear proveedor');
    }
  }
);

const initialState = {
  items: [],
  proveedores: [],
  isLoading: false,
  error: null,
  selectedItem: null,
  selectedProveedor: null,
};

const comprasSlice = createSlice({
  name: 'compras',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setSelectedProveedor: (state, action) => {
      state.selectedProveedor = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch proveedores
      .addCase(fetchProveedores.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProveedores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.proveedores = action.payload;
      })
      .addCase(fetchProveedores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create item
      .addCase(createItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create proveedor
      .addCase(createProveedor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProveedor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.proveedores.push(action.payload);
      })
      .addCase(createProveedor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedItem, setSelectedProveedor, clearError } = comprasSlice.actions;
export default comprasSlice.reducer; 