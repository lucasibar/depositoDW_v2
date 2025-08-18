const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://derwill-deposito-backend.onrender.com';

// Función para obtener el store de Redux (se inicializará después)
let store = null;

export const setStore = (reduxStore) => {
  store = reduxStore;
};

export const authService = {
  async login(username, password) {
    try {   
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          password: password
        }),
      });

      const data = await response.json();   

      localStorage.setItem('token', data.token);
      const user = {
        name: data.name,
        role: data.role
      };
      localStorage.setItem('user', JSON.stringify(user));

      // Actualizar Redux si está disponible
      if (store) {
        store.dispatch({ type: 'auth/setUser', payload: user });
      }

      return data;
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Actualizar Redux si está disponible
    if (store) {
      store.dispatch({ type: 'auth/logout' });
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
}; 