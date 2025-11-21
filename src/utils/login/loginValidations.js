/**
 * Utilidades de validación para el formulario de login
 * Funciones puras sin dependencias externas
 */

/**
 * Valida el formato del nombre de usuario
 * @param {string} username - Nombre de usuario a validar
 * @returns {{isValid: boolean, error: string|null}}
 */
export const validateUsername = (username) => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'El nombre de usuario es requerido' };
  }

  if (username.trim().length < 3) {
    return { isValid: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }

  if (username.length > 50) {
    return { isValid: false, error: 'El nombre de usuario no puede exceder 50 caracteres' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida el formato de la contraseña
 * @param {string} password - Contraseña a validar
 * @returns {{isValid: boolean, error: string|null}}
 */
export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida todo el formulario de login
 * @param {object} formData - Datos del formulario {username, password}
 * @returns {{isValid: boolean, errors: object}}
 */
export const validateLoginForm = (formData) => {
  const usernameValidation = validateUsername(formData.username);
  const passwordValidation = validatePassword(formData.password);

  const errors = {};
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
  }
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return {
    isValid: usernameValidation.isValid && passwordValidation.isValid,
    errors,
  };
};

/**
 * Limpia y normaliza los datos del formulario
 * @param {object} formData - Datos del formulario
 * @returns {object} - Datos normalizados
 */
export const normalizeLoginData = (formData) => {
  return {
    username: formData.username?.trim() || '',
    password: formData.password || '',
  };
};

