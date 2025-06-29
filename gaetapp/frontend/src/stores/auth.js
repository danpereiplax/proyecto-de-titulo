export function setPerfil(perfil) {
  sessionStorage.setItem('perfil', perfil);
}

export function getPerfil() {
  return sessionStorage.getItem('perfil');
}

export function limpiarSesion() {
  sessionStorage.removeItem('perfil');
}
