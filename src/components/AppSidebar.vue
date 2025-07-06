<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'
import {
  Calendar,
  CalendarPlus,
  CalendarSync,
  Home,
  Inbox,
  Users,
  Settings,
  ChevronUp,
} from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isDirector = ref(false)

const checkDirector = async () => {
  try {
    isDirector.value = await userStore.hasRole('Director')
  } catch {
    isDirector.value = false
  }
}
// Menu items.
const items = [
  {
    title: 'Inicio',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Solicitar evento',
    url: '/request-event',
    icon: CalendarPlus,
  },
  {
    title: 'Solicitudes',
    url: '/inbox',
    icon: Inbox,
    onlyDirector: true,
  },
  {
    title: 'Modificar evento',
    url: '/modify-event',
    icon: CalendarSync,
    onlyDirector: true,
  },
  {
    title: 'Calendario',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Usuarios',
    url: '/users-search',
    icon: Users,
    onlyDirector: true,
  },
  {
    title: 'Configuración',
    url: '#',
    icon: Settings,
  },
]

const handleLogout = async () => {
  const { signOut } = useAuth()
  await signOut()
  router.push('/')
}

onMounted(() => {
  checkDirector()
})
watch(() => userStore.user, checkDirector)
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Aurora Calendar</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <template v-for="item in items" :key="item.title">
              <SidebarMenuItem v-if="!item.onlyDirector || isDirector">
                <SidebarMenuButton
                  asChild
                  :class="[
                    route.path == item.url
                      ? 'bg-primary text-primary-foreground font-semibold hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground'
                      : '',
                  ]"
                >
                  <RouterLink :to="item.url">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <span
                  >{{ userStore.profile?.first_name }}
                  {{ userStore.profile?.last_name }}</span
                >
                <ChevronUp class="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" class="w-[240px]">
              <DropdownMenuItem>
                <RouterLink to="/profile" class="w-100">Mi perfil</RouterLink>
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleLogout">
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
