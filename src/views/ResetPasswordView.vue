<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { useSupabase } from '@/clients/supabase'

const { supabase } = useSupabase()

const router = useRouter()
const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleReset = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('Las contraseñas no coinciden.')
    return
  }
  loading.value = true
  const { error } = await supabase.auth.updateUser({ password: password.value })
  loading.value = false
  if (error) {
    toast.error(error.message, {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#EF4444',
        color: '#fff',
        border: 'none',
      },
    })
  } else {
    toast.success('Contraseña actualizada correctamente.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#4ade80',
        color: '#fff',
        border: 'none',
      },
    })
    router.push('/login')
  }
}

onMounted(async () => {
  // Verifica si el usuario está autenticado (por sesión normal o temporal)
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    toast.error('Sesión de recuperación no válida o expirada.')
    router.push('/login')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-muted">
    <form
      class="bg-white p-8 rounded shadow-md w-full max-w-md grid gap-6"
      @submit.prevent="handleReset"
    >
      <h1 class="text-2xl font-bold text-center">Restablecer contraseña</h1>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            v-model="password"
            placeholder="Nueva contraseña"
            required
          />
        </div>
        <div class="grid gap-2">
          <Label for="confirm">Confirmar contraseña</Label>
          <Input
            id="confirm"
            type="password"
            v-model="confirmPassword"
            placeholder="Confirma tu contraseña"
            required
          />
        </div>
      </div>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
      </Button>
    </form>
  </div>
</template>
