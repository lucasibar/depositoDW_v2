import { authService } from '../../../services/authService';

/**
 * Verifica si el usuario está autenticado y redirige si es necesario
 * @param {Function} navigate - Función de navegación de React Router
 * @returns {Object|null} - Usuario actual o null si no está autenticado
 */
export const checkAuthentication = (navigate) => {
  const currentUser = authService.getUser();
  if (!currentUser) {
    navigate('/');
    return null;
  }
  return currentUser;
};

/**
 * Maneja el logout del usuario
 * @param {Function} navigate - Función de navegación de React Router
 */
export const handleLogout = (navigate) => {
  authService.logout();
  navigate('/');
}; 