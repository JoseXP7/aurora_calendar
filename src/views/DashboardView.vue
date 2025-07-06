<script setup>
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()
</script>

<template>
  <section>
    <div class="m-5">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-gray-500 text-sm">Información general</p>
    </div>
    <div class="m-5">
      <h2 class="text-xl font-semibold">
        Bienvenid@, {{ userStore.profile?.first_name }}
        {{ userStore.profile?.last_name }}

        <!-- Seccion de cards para navegar-->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
        >
          <RouterLink
            to="/calendar"
            class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 class="text-lg font-semibold text-primary">Calendario</h3>
            <p class="text-gray-600">Accede al calendario.</p>
          </RouterLink>
          <RouterLink
            to="/profile"
            class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 class="text-lg font-semibold text-primary">Perfil</h3>
            <p class="text-gray-600">
              Gestiona tu perfil y configuración personal.
            </p>
          </RouterLink>
          <RouterLink
            to="/"
            class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 class="text-lg font-semibold text-primary">Configuración</h3>
            <p class="text-gray-600">Ajustes y preferencias.</p>
          </RouterLink>
          <RouterLink
            to="/"
            class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 class="text-lg font-semibold text-primary">Ayuda</h3>
            <p class="text-gray-600">Accede a la documentación y soporte.</p>
          </RouterLink>
        </div>
      </h2>
    </div>
  </section>
</template>
