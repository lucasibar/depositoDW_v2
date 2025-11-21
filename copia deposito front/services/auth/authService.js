const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://derwill-deposito-backend.onrender.com';

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

      return data;
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
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