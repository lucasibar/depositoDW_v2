/**
 * Obtiene el color del chip para un rol específico
 * @param {string} role - Rol del usuario
 * @returns {string} - Color del chip
 */
export const getRoleColor = (role) => {
  switch (role) {
    case 'admin':
      return 'error';
    case 'gerente':
      return 'warning';
    case 'supervisor':
      return 'info';
    case 'operador':
      return 'success';
    default:
      return 'default';
  }
};

/**
 * Obtiene la etiqueta legible para un rol específico
 * @param {string} role - Rol del usuario
 * @returns {string} - Etiqueta del rol
 */
export const getRoleLabel = (role) => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'gerente':
      return 'Gerente';
    case 'supervisor':
      return 'Supervisor';
    case 'operador':
      return 'Operador';
    default:
      return role;
  }
}; 