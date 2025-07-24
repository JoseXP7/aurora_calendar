<script setup>
import { ref } from 'vue'
import { Menu, X, Facebook, Instagram } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'

const navigation = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/tejiendoredeslara',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/fundaciontejiendoredes/',
    icon: Instagram,
  },
]

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="bg-white">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav
        class="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <RouterLink to="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Fundación Tejiendo Redes</span>
            <img class="h-8 w-auto" src="../assets/aurora_logo.svg" alt="" />
          </RouterLink>
        </div>
        <div class="flex lg:hidden">
          <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <Menu class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.href"
            class="text-sm/6 font-semibold text-gray-900 flex items-center gap-2 hover:text-primary"
            ><component :is="item.icon" /> <span>{{ item.name }}</span></a
          >
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <RouterLink to="/login" class="text-sm/6 font-semibold text-gray-900"
            >Iniciar sesión <span aria-hidden="true">&rarr;</span></RouterLink
          >
        </div>
      </nav>
    </header>

    <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 flex lg:hidden">
      <div
        class="fixed inset-0 bg-gray-900/80"
        @click="mobileMenuOpen = false"
      ></div>
      <div class="relative ml-auto w-full max-w-xs bg-white p-6">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Fundación Tejiendo Redes</span>
            <img class="h-8 w-auto" src="../assets/aurora_logo.svg" alt="" />
          </RouterLink>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Cerrar</span>
            <X class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >{{ item.name }}</a
              >
            </div>
            <div class="py-6">
              <RouterLink
                to="/login"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >Iniciar sesión</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative isolate px-6 pt-14 lg:px-8">
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div class="relative w-[28rem] h-[28rem]">
          <div
            class="absolute top-0 -left-4 w-72 h-72 bg-[#5158D2] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"
          ></div>
          <div
            class="absolute top-0 -right-4 w-72 h-72 bg-[#72B6F2] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"
          ></div>
          <div
            class="absolute -bottom-8 left-20 w-72 h-72 bg-[#5344DA] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"
          ></div>
        </div>
      </div>
      <div class="relative z-10 mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div class="text-center">
          <h1
            class="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl"
          >
            Aumenta la productividad en tu equipo
          </h1>
          <p
            class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"
          >
            Aurora es una herramienta de gestión de eventos que te ayuda a
            organizar tareas y colaborar con tu equipo.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <Button as-child
              ><RouterLink to="/register">Empezar</RouterLink></Button
            >
            <Button as-child variant="link"
              ><RouterLink to="/"
                >Leer más <span aria-hidden="true">→</span></RouterLink
              ></Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
