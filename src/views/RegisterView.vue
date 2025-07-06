<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
// Regular expression to validate Gmail addresses with at least 8 characters before the '@'
let emailregEx = /[^@ \t\r\n]{8,}@gmail\.com/g
const { signUpWithPassw } = useAuth()

const signup = async () => {
  loading.value = true
  if (emailregEx.test(email.value) == false) {
    //variante destructive
    toast.error('El correo debe ser de Gmail y tener al menos 8 caracteres', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#EF4444',
        color: '#fff',
        border: 'none',
      },
    })
    loading.value = false
  } else if (password.value !== passwordConfirm.value) {
    toast.error('Las contraseñas no coinciden', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#EF4444',
        color: '#fff',
        border: 'none',
      },
    })
  } else if (!email.value || !password.value || !passwordConfirm.value) {
    toast.error('Por favor, completa todos los campos.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#EF4444',
        color: '#fff',
        border: 'none',
      },
    })
    loading.value = false
    return
  } else {
    loading.value = true
    try {
      await signUpWithPassw({
        email: email.value,
        password: password.value,
      })
      router.push('/createProfile')
    } catch (error) {
      toast.error(error.message, {
        position: 'bottom-right',
        duration: 5000,
        style: {
          backgroundColor: '#EF4444',
          color: '#fff',
          border: 'none',
        },
      })
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="hidden bg-muted lg:block">
      <img
        src="../assets/register_bg.webp"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
    <div class="flex items-center justify-center py-12">
      <form
        class="mx-auto grid w-[350px] gap-6"
        autocomplete="off"
        action=""
        @submit.prevent="signup()"
      >
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Regístrate</h1>
          <p class="text-balance text-muted-foreground">
            Ingresa tu correo electrónico y una contraseña para crear una cuenta
          </p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Correo</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              v-model="email"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Contraseña</Label>
            <Input id="password" type="password" v-model="password" />
          </div>
          <div class="grid gap-2">
            <Label for="password_confirm">Repite tu contraseña</Label>
            <Input
              id="password_confirm"
              type="password"
              v-model="passwordConfirm"
            />
          </div>
          <Button type="submit" :disabled="loading" class="w-full">
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
            {{ loading ? 'Cargando...' : 'Crear una cuenta' }}
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Ya tienes una cuenta?
          <RouterLink to="/login" class="underline text-primary">
            Iniciar sesión
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
