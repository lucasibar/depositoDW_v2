const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const stockApi = {
  async getAllMovimientos() {
    try {
      const response = await fetch(`${API_BASE_URL}/movimientos`);
      if (!response.ok) throw new Error("Error fetching movimientos");
      return response.json();
    } catch (error) {
      console.error("Error en getAllMovimientos:", error);
      throw error;
    }
  },

  async searchMaterials(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/stock/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Error searching materials");
      return response.json();
    } catch (error) {
      console.error("Error en searchMaterials:", error);
      throw error;
    }
  },

  async getStockByItem(itemName) {
    try {
      const response = await fetch(`${API_BASE_URL}/stock/item/${encodeURIComponent(itemName)}`);
      if (!response.ok) throw new Error("Error fetching stock by item");
      return response.json();
    } catch (error) {
      console.error("Error en getStockByItem:", error);
      throw error;
    }
  }
};
