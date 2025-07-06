<script setup>
import Table from '@/components/Table.vue'
import { useSupabase } from '@/clients/supabase'
import { ref, onMounted, watch } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'vue-sonner'

const { supabase } = useSupabase()

const usuarios = ref([])
const userRole = ref(null)
const dialogOpen = ref(false)
const selectUser = ref(null)
const loading = ref(false)

// Define los inputs para actualizar el usuario
const first_name = ref('')
const last_name = ref('')
const phone_number = ref('')
const entidad = ref('')

const role = ref(0)

// Define las columnas a mostrar
const columns = [
  { key: 'id', label: 'Número' },
  { key: 'first_name', label: 'Nombres' },
  { key: 'last_name', label: 'Apellidos' },
  { key: 'phone_number', label: 'Teléfono' },
  { key: 'entidad', label: 'Entidad' },
]

const fetchUsuarios = async () => {
  const { data, error } = await supabase.from('profiles').select(
    `
      id,
      first_name,
      last_name,
      entidad,
      phone_number
    `
  )

  if (error) throw error

  usuarios.value = data
}

const fetchUserRole = async (userId) => {
  loading.value = true
  const { data, error } = await supabase
    .from('user_roles')
    .select(
      `
    id,
    user_id,
    role_id,
    roles (
      role_name
    )
  `
    )
    .eq('user_id', userId)
    .single()

  if (error) throw error

  userRole.value = data
  role.value = data.role_id
  loading.value = false
}

const openDialog = (item) => {
  first_name.value = item.first_name
  last_name.value = item.last_name
  phone_number.value = item.phone_number
  entidad.value = item.entidad
  selectUser.value = item

  fetchUserRole(item.id)
  dialogOpen.value = true
}

const updateUser = async () => {
  if (
    !first_name.value ||
    !last_name.value ||
    !phone_number.value ||
    !entidad.value
  ) {
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
    const updates = {
      first_name: first_name.value,
      last_name: last_name.value,
      phone_number: phone_number.value,
      entidad: entidad.value,
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', selectUser.value.id)

    if (error) throw error

    toast.success('Usuario actualizado.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#4ade80',
        color: '#fff',
        border: 'none',
      },
    })

    fetchUsuarios()

    dialogOpen.value = false
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

const updateRole = async () => {
  try {
    loading.value = true
    const { error } = await supabase
      .from('user_roles')
      .update({ role_id: role.value })
      .eq('id', userRole.value.id)

    if (error) throw error

    toast.success('Rol actualizado.', {
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
    return
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsuarios()
})
</script>

<template>
  <section>
    <div class="m-5">
      <h1 class="text-2xl font-bold">Usuarios</h1>
      <p class="text-gray-500 text-sm">
        Aquí puedes gestionar los usuarios del sistema.
      </p>
    </div>
    <div class="m-5">
      <Table :items="usuarios" :columns="columns" :page-size="5">
        <template #cell-id="{ value, item }">
          <Button @click="openDialog(item)">
            {{ value }}
          </Button>
        </template>
      </Table>
    </div>

    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> ID del Usuario: {{ selectUser?.id }} </DialogTitle>
          <DialogDescription class="text-black">
            <div class="space-y-2 mb-2">
              <Label for="first_name">Nombres</Label>
              <Input id="first_name" type="text" v-model="first_name" />
            </div>
            <div class="space-y-2 mb-2">
              <Label for="last_name">Apellidos</Label>
              <Input id="last_name" type="text" v-model="last_name" />
            </div>
            <div class="space-y-2 mb-2">
              <Label for="phone_number">Teléfono</Label>
              <Input id="phone_number" type="tel" v-model="phone_number" />
            </div>
            <div class="space-y-2 mb-2">
              <Label for="entidad">Entidad</Label>
              <Select id="entidad" v-model="entidad">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rectorado</SelectLabel>
                    <SelectItem value="DDE">
                      Dirección de Desarrollo Estudiantil
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Centros de Estudiantes</SelectLabel>
                    <SelectItem value="CEDCYT"> DCYT </SelectItem>
                    <SelectItem value="CEDAG"> DAG </SelectItem>
                    <SelectItem value="CEDIC"> DIC </SelectItem>
                    <SelectItem value="CEDCV"> DCV </SelectItem>
                    <SelectItem value="CEDCS"> DCS </SelectItem>
                    <SelectItem value="CEDEHA"> DEHA </SelectItem>
                    <SelectItem value="CEDEHA"> DCEE </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-2 mb-2">
          <Label for="role">Rol del Usuario</Label>
          <div class="flex items-center gap-2">
            <Select id="role" v-model="role" :disabled="loading">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opcion" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem :value="1">Staff</SelectItem>
                  <SelectItem :value="2">Centro de Estudiantes</SelectItem>
                  <SelectItem :value="3">Director</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              variant="success"
              class="rounded-full"
              @click="updateRole()"
              :disabled="loading"
              ><Check
            /></Button>
          </div>
        </div>
        <DialogFooter class="flex gap-2">
          <Button variant="success" @click="updateUser()" :disabled="loading"
            >Actualizar</Button
          >
          <Button variant="secondary" @click="dialogOpen = false"
            >Cerrar</Button
          >
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>
