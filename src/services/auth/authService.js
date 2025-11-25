const API_BASE_URL = 'https://derwill-deposito-backend.onrender.com';

class AuthService {
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        const storedUser = {
          name: data.name ?? data.user?.name ?? '',
          role: data.role || data.user?.role || '',
        };
        localStorage.setItem('user', JSON.stringify(storedUser));
      }

      return {
        role: data.role || data.user?.role,
        token: data.token,
        user: data.name,
      };
    } catch (error) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return Boolean(localStorage.getItem('token'));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  }
}

export const authService = new AuthService();
