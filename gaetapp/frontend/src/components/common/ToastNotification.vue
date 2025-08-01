<!-- frontend/src/components/common/ToastNotification.vue -->
<template>
  <div v-if="show" class="fixed z-50 bottom-4 right-4">
    <div :class="[
      'px-6 py-4 rounded-lg shadow-lg text-white transition-all duration-300',
      getTypeClass(type)
    ]">
      <div class="flex items-center">
        <i :class="getIcon(type)" class="mr-2"></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToastNotification',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    }
  },
  methods: {
    getTypeClass(type) {
      const classes = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
      }
      return classes[type] || 'bg-green-500'
    },
    getIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
      }
      return icons[type] || 'fas fa-check-circle'
    }
  }
}
</script>