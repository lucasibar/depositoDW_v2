import { apiClient } from '../config/api';

export const consultaStockService = {
    obtenerDisponibilidad: async (itemId, kilosPedidos) => {
        try {
            const response = await apiClient.get(`/consulta-stock/disponibilidad/${itemId}/${kilosPedidos}`);
            return response.data;
        } catch (error) {
            console.error('Error al consultar disponibilidad:', error);
            throw error;
        }
    },
};
