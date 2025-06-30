// stores/auth.js

// Guarda el perfil en sessionStorage
export function setPerfil(perfil) {
  sessionStorage.setItem('perfil', perfil);
}

// Obtiene el perfil desde sessionStorage
export function getPerfil() {
  return sessionStorage.getItem('perfil');
}

// Guarda el token en sessionStorage
export function setToken(token) {
  sessionStorage.setItem('token', token);
}

// Obtiene el token desde sessionStorage
export function getToken() {
  return sessionStorage.getItem('token');
}

// Limpia toda la sesión
export function limpiarSesion() {
  sessionStorage.removeItem('perfil');
  sessionStorage.removeItem('token');
}
