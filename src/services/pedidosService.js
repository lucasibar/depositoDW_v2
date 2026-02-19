import { apiClient } from '../config/api';

export const pedidosService = {
    // Obtener todos los pedidos (historial)
    obtenerPedidos: async () => {
        try {
            const response = await apiClient.get('/pedidos');
            return response.data;
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            throw error;
        }
    },

    // Obtener un pedido por ID
    obtenerPedido: async (id) => {
        try {
            const response = await apiClient.get(`/pedidos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener el pedido:', error);
            throw error;
        }
    },

    // Crear un nuevo pedido
    crearPedido: async (pedidoData) => {
        try {
            const response = await apiClient.post('/pedidos', pedidoData);
            return response.data;
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            throw error;
        }
    },

    // Obtener clientes (proveedores con categoria cliente)
    obtenerClientes: async () => {
        try {
            const response = await apiClient.get('/pedidos/clientes');
            return response.data;
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            throw error;
        }
    },

    // Eliminar un pedido
    eliminarPedido: async (id) => {
        try {
            await apiClient.delete(`/pedidos/${id}`);
        } catch (error) {
            console.error('Error al eliminar el pedido:', error);
            throw error;
        }
    },

    // Obtener estadísticas de picking
    obtenerPickingStats: async (fecha) => {
        try {
            const response = await apiClient.get(`/pedidos/picking?fecha=${fecha}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas de picking:', error);
            throw error;
        }
    }
};
