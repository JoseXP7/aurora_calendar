<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import 'vue-sonner/style.css'
import { addDatePrototypes } from 'vue-cal'

addDatePrototypes()

const route = useRoute()
const showSidebar = computed(() => route.meta.showSidebar)
</script>

<template>
  <div class="overflow-x-hidden min-h-screen flex">
    <SidebarProvider>
      <AppSidebar v-if="showSidebar" />
      <main class="flex-1 flex flex-col">
        <SidebarTrigger v-if="showSidebar" />
        <slot />
        <RouterView v-slot="{ Component }">
          <transition name="route" mode="out-in">
            <Component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </SidebarProvider>
  </div>
  <Toaster />
</template>

<style scoped>
.route-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.route-enter-active {
  transition: all 0.2s ease-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.route-leave-active {
  transition: all 0.2s ease-in;
}
</style>
