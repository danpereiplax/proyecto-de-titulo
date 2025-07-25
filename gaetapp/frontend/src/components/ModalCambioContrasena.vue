<template>
  <div v-if="mostrarModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Encabezado -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 015.743-7.743z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900">Cambiar Contraseña</h3>
          </div>
          <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600">
            <span class="sr-only">Cerrar</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Alerta si requiere cambio obligatorio -->
        <div v-if="esRequerido" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex">
            <svg class="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-yellow-800">Cambio de Contraseña Requerido</h4>
              <p class="text-sm text-yellow-700">
                Debes cambiar tu contraseña temporal antes de continuar.
              </p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="cambiarContrasena">
          <!-- Contraseña Actual -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña Actual *
            </label>
            <div class="relative">
              <input 
                v-model="formularioContrasena.contrasenaActual" 
                :type="mostrarContrasenaActual ? 'text' : 'password'"
                required 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                :class="{ 'border-red-300': errores.contrasenaActual }"
              >
              <button 
                type="button"
                @click="mostrarContrasenaActual = !mostrarContrasenaActual"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!mostrarContrasenaActual" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path v-if="!mostrarContrasenaActual" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-if="mostrarContrasenaActual" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errores.contrasenaActual" class="mt-1 text-sm text-red-600">{{ errores.contrasenaActual }}</p>
          </div>

          <!-- Nueva Contraseña -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña *
            </label>
            <div class="relative">
              <input 
                v-model="formularioContrasena.nuevaContrasena" 
                :type="mostrarNuevaContrasena ? 'text' : 'password'"
                required 
                minlength="6"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                :class="{ 'border-red-300': errores.nuevaContrasena }"
              >
              <button 
                type="button"
                @click="mostrarNuevaContrasena = !mostrarNuevaContrasena"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!mostrarNuevaContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path v-if="!mostrarNuevaContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-if="mostrarNuevaContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
            <!-- Indicador de fortaleza de contraseña -->
            <div class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="claseFortalezaContrasena"
                    :style="{ width: porcentajeFortalezaContrasena + '%' }"
                  ></div>
                </div>
                <span class="text-xs font-medium" :class="claseTextoFortaleza">
                  {{ textoFortalezaContrasena }}
                </span>
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-500">Mínimo 6 caracteres</p>
            <p v-if="errores.nuevaContrasena" class="mt-1 text-sm text-red-600">{{ errores.nuevaContrasena }}</p>
          </div>

          <!-- Confirmar Nueva Contraseña -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nueva Contraseña *
            </label>
            <div class="relative">
              <input 
                v-model="formularioContrasena.confirmarContrasena" 
                :type="mostrarConfirmarContrasena ? 'text' : 'password'"
                required 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                :class="{ 'border-red-300': errores.confirmarContrasena }"
              >
              <button 
                type="button"
                @click="mostrarConfirmarContrasena = !mostrarConfirmarContrasena"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!mostrarConfirmarContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path v-if="!mostrarConfirmarContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-if="mostrarConfirmarContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errores.confirmarContrasena" class="mt-1 text-sm text-red-600">{{ errores.confirmarContrasena }}</p>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3">
            <button 
              v-if="!esRequerido"
              type="button" 
              @click="cerrarModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="cargando || !esFormularioValido"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ cargando ? 'Cambiando...' : 'Cambiar Contraseña' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalCambioContrasena',
  props: {
    mostrarModal: {
      type: Boolean,
      default: false
    },
    esRequerido: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cerrar', 'contrasena-cambiada'],
  data() {
    return {
      cargando: false,
      mostrarContrasenaActual: false,
      mostrarNuevaContrasena: false,
      mostrarConfirmarContrasena: false,
      formularioContrasena: {
        contrasenaActual: '',
        nuevaContrasena: '',
        confirmarContrasena: ''
      },
      errores: {}
    }
  },
  computed: {
    esFormularioValido() {
      return this.formularioContrasena.contrasenaActual && 
             this.formularioContrasena.nuevaContrasena && 
             this.formularioContrasena.confirmarContrasena &&
             this.formularioContrasena.nuevaContrasena === this.formularioContrasena.confirmarContrasena &&
             this.formularioContrasena.nuevaContrasena.length >= 6;
    },
    
    fortalezaContrasena() {
      const contrasena = this.formularioContrasena.nuevaContrasena;
      if (!contrasena) return 0;
      
      let puntuacion = 0;
      
      // Longitud
      if (contrasena.length >= 6) puntuacion += 1;
      if (contrasena.length >= 8) puntuacion += 1;
      
      // Complejidad
      if (/[a-z]/.test(contrasena)) puntuacion += 1;
      if (/[A-Z]/.test(contrasena)) puntuacion += 1;
      if (/[0-9]/.test(contrasena)) puntuacion += 1;
      if (/[^A-Za-z0-9]/.test(contrasena)) puntuacion += 1;
      
      return Math.min(puntuacion, 4);
    },
    
    porcentajeFortalezaContrasena() {
      return (this.fortalezaContrasena / 4) * 100;
    },
    
    claseFortalezaContrasena() {
      switch (this.fortalezaContrasena) {
        case 0:
        case 1:
          return 'bg-red-500';
        case 2:
          return 'bg-yellow-500';
        case 3:
          return 'bg-blue-500';
        case 4:
          return 'bg-green-500';
        default:
          return 'bg-gray-300';
      }
    },
    
    claseTextoFortaleza() {
      switch (this.fortalezaContrasena) {
        case 0:
        case 1:
          return 'text-red-600';
        case 2:
          return 'text-yellow-600';
        case 3:
          return 'text-blue-600';
        case 4:
          return 'text-green-600';
        default:
          return 'text-gray-500';
      }
    },
    
    textoFortalezaContrasena() {
      switch (this.fortalezaContrasena) {
        case 0:
          return 'Muy débil';
        case 1:
          return 'Débil';
        case 2:
          return 'Regular';
        case 3:
          return 'Fuerte';
        case 4:
          return 'Muy fuerte';
        default:
          return '';
      }
    }
  },
  watch: {
    mostrarModal(nuevo) {
      if (nuevo) {
        this.reiniciarFormulario();
      }
    },
    
    'formularioContrasena.nuevaContrasena'() {
      this.validarContrasenas();
    },
    
    'formularioContrasena.confirmarContrasena'() {
      this.validarContrasenas();
    }
  },
  methods: {
    reiniciarFormulario() {
      this.formularioContrasena = {
        contrasenaActual: '',
        nuevaContrasena: '',
        confirmarContrasena: ''
      };
      this.errores = {};
      this.cargando = false;
      this.mostrarContrasenaActual = false;
      this.mostrarNuevaContrasena = false;
      this.mostrarConfirmarContrasena = false;
    },
    
    validarContrasenas() {
      this.errores = {};
      
      // Validar nueva contraseña
      if (this.formularioContrasena.nuevaContrasena && this.formularioContrasena.nuevaContrasena.length < 6) {
        this.errores.nuevaContrasena = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      // Validar confirmación
      if (this.formularioContrasena.confirmarContrasena && 
          this.formularioContrasena.nuevaContrasena !== this.formularioContrasena.confirmarContrasena) {
        this.errores.confirmarContrasena = 'Las contraseñas no coinciden';
      }
    },
    
    async cambiarContrasena() {
      this.cargando = true;
      this.errores = {};
      
      try {
        // Validaciones finales
        if (!this.esFormularioValido) {
          throw new Error('Por favor verifica que todos los campos sean válidos');
        }
        
        // Emitir evento con los datos de la contraseña
        this.$emit('contrasena-cambiada', {
          currentPassword: this.formularioContrasena.contrasenaActual,
          newPassword: this.formularioContrasena.nuevaContrasena
        });
        
      } catch (error) {
        console.error('Error en cambiarContrasena:', error);
        this.errores.general = error.message || 'Error al cambiar la contraseña';
      } finally {
        this.cargando = false;
      }
    },
    
    cerrarModal() {
      if (!this.esRequerido) {
        this.$emit('cerrar');
        this.reiniciarFormulario();
      }
    }
  }
}
</script>

<style scoped>
/* Animaciones para el indicador de fortaleza */
.transition-all {
  transition: all 0.3s ease;
}
</style>