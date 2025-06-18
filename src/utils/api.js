// Utilidad para obtener la URL base del backend desde variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_URL;

export function apiFetch(endpoint, options = {}) {
  return fetch(`${API_BASE_URL}${endpoint}`, options);
}
