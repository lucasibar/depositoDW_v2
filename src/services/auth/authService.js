const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://derwill-deposito-backend.onrender.com';

class AuthService {
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return {
        role: data.role || data.user?.role,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor');
      }
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
