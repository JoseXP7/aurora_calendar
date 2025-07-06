<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'

const router = useRouter()

const loading = ref(false)
const email = ref('')
const password = ref('')

const { loginWithPassw } = useAuth()

const login = async () => {
  loading.value = true
  try {
    await loginWithPassw({
      email: email.value,
      password: password.value,
    })
    router.push('/dashboard')

    toast.success('Inicio de sesión exitoso.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#4ade80',
        color: '#fff',
        border: 'none',
      },
    })
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
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <form
        class="mx-auto grid w-[350px] gap-6"
        autocomplete="off"
        action=""
        @submit.prevent="login()"
      >
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Iniciar Sesión</h1>
          <p class="text-balance text-muted-foreground">
            Ingresa tu correo electrónico y contraseña para entrar a tu cuenta
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
            <div class="flex items-center">
              <Label for="password">Contraseña</Label>
              <a
                href="/"
                class="ml-auto inline-block text-sm underline text-primary"
              >
                Olvidaste tu contraseña?
              </a>
            </div>
            <Input id="password" type="password" v-model="password" />
          </div>
          <Button
            type="submit"
            @click="login"
            class="w-full"
            :disabled="loading"
          >
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
            {{ loading ? 'Cargando...' : 'Acceder' }}
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          No tienes una cuenta?
          <RouterLink to="/register" class="underline text-primary">
            Regístrate
          </RouterLink>
        </div>
      </form>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="../assets/login_bg.webp"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
