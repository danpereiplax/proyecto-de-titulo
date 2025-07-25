<template>
  <div v-if="mostrarModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Encabezado del Modal -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ modo === 'crear' ? 'Crear Usuario' : 'Editar Usuario' }}
          </h3>
          <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600">
            <span class="sr-only">Cerrar</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="enviarFormulario">
          <!-- RUT -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">RUT *</label>
            <div class="flex space-x-2">
              <input 
                v-model="formularioUsuario.rut_persona" 
                type="number"
                required 
                placeholder="12345678"
                :disabled="modo === 'editar'"
                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
              <input 
                v-model="formularioUsuario.rut_dv_persona" 
                type="text"
                maxlength="1"
                required 
                placeholder="9"
                :disabled="modo === 'editar'"
                class="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Nombre -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input 
              v-model="formularioUsuario.nombre_persona" 
              type="text"
              required 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <!-- Apellidos -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno *</label>
              <input 
                v-model="formularioUsuario.apellido_paterno_persona" 
                type="text"
                required 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input 
                v-model="formularioUsuario.apellido_materno_persona" 
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Corporativo *</label>
            <input 
              v-model="formularioUsuario.email_corporativo" 
              type="email"
              required 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <!-- Teléfono -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              v-model="formularioUsuario.telefono" 
              type="tel"
              placeholder="+56987654321"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <!-- Nombre de Usuario -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario *</label>
            <input 
              v-model="formularioUsuario.username" 
              type="text"
              required 
              :disabled="modo === 'editar'"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <!-- Perfil -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Perfil *</label>
            <select 
              v-model="formularioUsuario.id_perfil_usuario" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar perfil</option>
              <option value="1">ADMINISTRADOR</option>
              <option value="2">SUPERVISOR</option>
              <option value="3">TÉCNICO</option>
            </select>
          </div>

          <!-- Sección de Contraseña - Solo al crear -->
          <div v-if="modo === 'crear'" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="text-sm font-medium text-blue-900 mb-3">🔐 Configuración de Contraseña</h4>
            
            <!-- Opciones de contraseña -->
            <div class="space-y-3">
              <div class="flex items-center">
                <input 
                  id="contrasena-manual" 
                  v-model="opcionContrasena" 
                  value="manual"
                  type="radio" 
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                >
                <label for="contrasena-manual" class="ml-2 block text-sm text-gray-700">
                  Establecer contraseña manualmente
                </label>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="contrasena-automatica" 
                  v-model="opcionContrasena" 
                  value="auto"
                  type="radio" 
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                >
                <label for="contrasena-automatica" class="ml-2 block text-sm text-gray-700">
                  Generar contraseña automática
                </label>
              </div>
            </div>

            <!-- Campo de contraseña manual -->
            <div v-if="opcionContrasena === 'manual'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña Inicial *
              </label>
              <div class="relative">
                <input 
                  v-model="formularioUsuario.password" 
                  :type="mostrarContrasena ? 'text' : 'password'"
                  required 
                  minlength="6"
                  placeholder="Mínimo 6 caracteres"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                >
                <button 
                  type="button"
                  @click="mostrarContrasena = !mostrarContrasena"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="!mostrarContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path v-if="!mostrarContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path v-if="mostrarContrasena" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Información sobre contraseña automática -->
            <div v-if="opcionContrasena === 'auto'" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p class="text-sm text-yellow-800">
                <strong>📋 Nota:</strong> Se generará una contraseña temporal que se mostrará después de crear el usuario.
              </p>
            </div>

            <!-- Checkbox para forzar cambio -->
            <div class="mt-4 flex items-center">
              <input 
                id="requiere-cambio-contrasena" 
                v-model="formularioUsuario.requiere_cambio_password" 
                type="checkbox" 
                checked
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="requiere-cambio-contrasena" class="ml-2 block text-sm text-gray-700">
                Requiere cambio de contraseña en el primer acceso
              </label>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="cerrarModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="cargando"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ cargando ? 'Guardando...' : (modo === 'crear' ? 'Crear Usuario' : 'Actualizar Usuario') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal para mostrar contraseña generada -->
  <div v-if="mostrarContrasenaGenerada" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-32 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          ✅ Usuario Creado Exitosamente
        </h3>
        
        <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-gray-700 mb-2">
            <strong>Contraseña temporal generada:</strong>
          </p>
          <div class="flex items-center justify-center space-x-2">
            <code class="text-lg font-mono bg-gray-100 px-3 py-2 rounded">
              {{ contrasenaGenerada }}
            </code>
            <button 
              @click="copiarContrasena"
              class="p-2 text-gray-500 hover:text-gray-700"
              title="Copiar contraseña"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            ⚠️ Guarda esta contraseña. El usuario deberá cambiarla en su primer acceso.
          </p>
        </div>
        
        <button 
          @click="cerrarModalContrasena"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalUsuario',
  props: {
    mostrarModal: {
      type: Boolean,
      default: false
    },
    modo: {
      type: String,
      default: 'crear' // 'crear' o 'editar'
    },
    usuario: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['cerrar', 'guardar'],
  data() {
    return {
      cargando: false,
      mostrarContrasena: false,
      opcionContrasena: 'auto', // 'manual' o 'auto'
      mostrarContrasenaGenerada: false,
      contrasenaGenerada: '',
      formularioUsuario: {
        rut_persona: '',
        rut_dv_persona: '',
        nombre_persona: '',
        apellido_paterno_persona: '',
        apellido_materno_persona: '',
        email_corporativo: '',
        email_personal: '',
        telefono: '',
        username: '',
        id_perfil_usuario: '',
        password: '',
        requiere_cambio_password: true
      }
    }
  },
  watch: {
    mostrarModal(nuevo) {
      if (nuevo) {
        this.reiniciarFormulario();
        if (this.modo === 'editar' && this.usuario) {
          this.llenarFormulario();
        }
      }
    },
    // Auto-generar username basado en nombre y apellido
    'formularioUsuario.nombre_persona'() {
      this.generarUsername();
    },
    'formularioUsuario.apellido_paterno_persona'() {
      this.generarUsername();
    }
  },
  methods: {
    reiniciarFormulario() {
      this.formularioUsuario = {
        rut_persona: '',
        rut_dv_persona: '',
        nombre_persona: '',
        apellido_paterno_persona: '',
        apellido_materno_persona: '',
        email_corporativo: '',
        email_personal: '',
        telefono: '',
        username: '',
        id_perfil_usuario: '',
        password: '',
        requiere_cambio_password: true
      };
      this.opcionContrasena = 'auto';
      this.mostrarContrasena = false;
      this.cargando = false;
    },
    
    llenarFormulario() {
      Object.keys(this.formularioUsuario).forEach(clave => {
        if (this.usuario[clave] !== undefined) {
          this.formularioUsuario[clave] = this.usuario[clave];
        }
      });
    },
    
    generarUsername() {
      if (this.formularioUsuario.nombre_persona && this.formularioUsuario.apellido_paterno_persona) {
        const nombre = this.formularioUsuario.nombre_persona.toLowerCase().trim();
        const apellido = this.formularioUsuario.apellido_paterno_persona.toLowerCase().trim();
        this.formularioUsuario.username = `${nombre}.${apellido}`;
      }
    },
    
    async enviarFormulario() {
      this.cargando = true;
      
      try {
        // Preparar datos para enviar
        const datosUsuario = { ...this.formularioUsuario };
        
        // Si no hay contraseña manual y es modo crear, indicar que se genere automática
        if (this.modo === 'crear' && this.opcionContrasena === 'auto') {
          datosUsuario.generatePassword = true;
          delete datosUsuario.password;
        }
        
        // Emitir evento con los datos
        this.$emit('guardar', {
          modo: this.modo,
          datos: datosUsuario,
          opcionContrasena: this.opcionContrasena
        });
        
      } catch (error) {
        console.error('Error en enviarFormulario:', error);
      } finally {
        this.cargando = false;
      }
    },
    
    cerrarModal() {
      this.$emit('cerrar');
      this.reiniciarFormulario();
    },
    
    mostrarContrasenaGeneradaModal(contrasena) {
      this.contrasenaGenerada = contrasena;
      this.mostrarContrasenaGenerada = true;
    },
    
    cerrarModalContrasena() {
      this.mostrarContrasenaGenerada = false;
      this.contrasenaGenerada = '';
      this.cerrarModal();
    },
    
    async copiarContrasena() {
      try {
        await navigator.clipboard.writeText(this.contrasenaGenerada);
        // Mostrar feedback visual (opcional)
        console.log('Contraseña copiada al portapapeles');
      } catch (err) {
        console.error('Error copiando contraseña:', err);
      }
    }
  }
}
</script>