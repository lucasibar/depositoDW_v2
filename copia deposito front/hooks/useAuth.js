import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    refreshUser();
    setIsLoading(false);

    const handleStorageChange = (event) => {
      if (event.key === 'user' || event.key === 'token') {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshUser]);

  const logout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  return {
    user,
    isLoading,
    logout,
    refreshUser,
  };
}; 