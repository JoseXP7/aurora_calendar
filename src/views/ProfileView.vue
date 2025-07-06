<script setup>
import { ref } from 'vue'
import { useSupabase } from '@/clients/supabase'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'

const { supabase } = useSupabase()
const userStore = useUserStore()

const first_name = ref(userStore.profile?.first_name || '')
const last_name = ref(userStore.profile?.last_name || '')
const phone = ref(userStore.profile?.phone_number || '')
const loading = ref(false)

const updateProfile = async () => {
  if (!first_name.value || !last_name.value || !phone.value) {
    toast.error('Por favor, completa todos los campos.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#EF4444',
        color: '#fff',
        border: 'none',
      },
    })
    return
  }

  try {
    loading.value = true
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: first_name.value,
        last_name: last_name.value,
        phone_number: phone.value,
      })
      .eq('id', userStore.user?.id)

    if (error) throw error

    userStore.getProfile()
    toast.success('Perfil actualizado correctamente.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#22C55E',
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
  <section>
    <div class="m-5">
      <h1 class="text-2xl font-bold">Perfil</h1>
      <p class="text-gray-500 text-sm">Aquí puedes ver y editar tu perfil.</p>
    </div>
    <div class="m-5">
      <h2 class="text-xl font-bold">Información Personal</h2>
      <hr class="my-2 border-primary w-[300px]" />
      <p>Nombres: {{ userStore.profile?.first_name }}</p>
      <p>Apellidos: {{ userStore.profile?.last_name }}</p>

      <p>Número de Teléfono: {{ userStore.profile?.phone_number }}</p>
      <p>Entidad: {{ userStore.profile?.entidad }}</p>

      <p>Correo Electrónico: {{ userStore.user?.email }}</p>
    </div>
    <div class="m-5">
      <Dialog>
        <DialogTrigger as-child>
          <Button> Editar perfil </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Realiza cambios en tu perfil aquí. Haz clic en guardar cuando
              hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <form
            id="profile-form"
            class="grid gap-4 py-4"
            autocomplete="off"
            @submit.prevent="updateProfile()"
          >
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right"> Nombres </Label>
              <Input
                id="name"
                type="text"
                class="col-span-3"
                v-model="first_name"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="lastname" class="text-right"> Apellidos </Label>
              <Input
                id="lastname"
                type="text"
                class="col-span-3"
                v-model="last_name"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="phone" class="text-right"> Teléfono </Label>
              <Input id="phone" type="tel" class="col-span-3" v-model="phone" />
            </div>
          </form>
          <DialogFooter>
            <Button type="submit" form="profile-form"> Guardar cambios </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </section>
</template>
