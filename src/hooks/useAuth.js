import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const logout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  return {
    user,
    isLoading,
    logout
  };
}; 