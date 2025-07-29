const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const comprasApi = {
  async createRemito(remitoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/remitos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(remitoData),
      });
      if (!response.ok) throw new Error("Error creating remito");
      return response.json();
    } catch (error) {
      console.error("Error en createRemito:", error);
      throw error;
    }
  },

  async getRemitos() {
    try {
      const response = await fetch(`${API_BASE_URL}/remitos`);
      if (!response.ok) throw new Error("Error fetching remitos");
      return response.json();
    } catch (error) {
      console.error("Error en getRemitos:", error);
      throw error;
    }
  },

  async getProveedores() {
    try {
      const response = await fetch(`${API_BASE_URL}/proveedores`);
      if (!response.ok) throw new Error("Error fetching proveedores");
      return response.json();
    } catch (error) {
      console.error("Error en getProveedores:", error);
      throw error;
    }
  }
};
