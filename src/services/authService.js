const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://derwill-deposito-backend.onrender.com';

export const authService = {
  async login(username, password) {
    try {   
      console.log('🔐 Intentando login con:', { username, password: '***' });
      console.log('🌐 URL:', `${API_BASE_URL}/auth/login`);
      
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

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error de login:', response.status, errorText);
        throw new Error(`Login failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();   
      console.log('✅ Login exitoso:', { name: data.name, role: data.role });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        name: data.name,
        role: data.role
      }));

      return data;
    } catch (error) {
      console.error('❌ Error completo:', error);
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