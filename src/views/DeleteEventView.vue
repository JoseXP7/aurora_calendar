<script setup>
import Table from '@/components/Table.vue'
import { useSupabase } from '@/clients/supabase'
import { ref, onMounted, watch } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ListPlus, ListRestart, Trash2 } from 'lucide-vue-next'
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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'vue-sonner'

const { supabase } = useSupabase()

const solicitudes = ref([])
const dialogOpen = ref(false)
const selectedEvent = ref(null)
const loading = ref(false)
const statusFilter = ref('Aprobado')

const selectedIds = ref([])

// Define las columnas a mostrar
const columns = [
  { key: 'Select', label: 'Sel.' },
  { key: 'id', label: 'Número' },
  { key: 'start', label: 'Inicio' },
  { key: 'end', label: 'Fin' },
  { key: 'title', label: 'Título' },
  { key: 'status', label: 'Estatus' },
]

const fetchSolicitudes = async () => {
  const { data, error } = await supabase
    .from('events')
    .select(
      `
      id,
      user_id,
      start,
      end,
      contentFull,
      status,
      title,
      profiles (
        first_name,
        last_name,
        entidad,
        phone_number
      )
    `
    )
    .eq('status', statusFilter.value)

  if (error) throw error

  solicitudes.value = data
}

watch(statusFilter, () => {
  fetchSolicitudes()
  selectedIds.value = []
  showSelectedToast()
})

const openDialog = (item) => {
  selectedEvent.value = item
  dialogOpen.value = true
  selectedIds.value = []
  showSelectedToast()
}

// Define un id fijo para el toast
const SELECTED_TOAST_ID = 'selected-ids-toast'

const showSelectedToast = () => {
  if (selectedIds.value.length) {
    toast(`IDs seleccionados: ${selectedIds.value.join(', ')}`, {
      id: SELECTED_TOAST_ID,
      duration: Infinity, // El toast no se cierra automáticamente
    })
  } else {
    toast.dismiss(SELECTED_TOAST_ID)
  }
}

const selectAll = () => {
  selectedIds.value = solicitudes.value.map((s) => s.id)
  showSelectedToast()
}

const deselectAll = () => {
  selectedIds.value = []
  showSelectedToast()
}

const deleteEvent = async (id) => {
  try {
    loading.value = true
    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) throw error

    toast.success('Evento eliminado con éxito.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#4ade80',
        color: '#fff',
        border: 'none',
      },
    })

    dialogOpen.value = false
    fetchSolicitudes()
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

const deleteMultipleEvents = async () => {
  if (selectedIds.value.length < 2) {
    toast.error('Selecciona al menos dos eventos para eliminar.', {
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
      .from('events')
      .delete()
      .in('id', selectedIds.value)

    if (error) throw error

    toast.success('Eventos eliminados con éxito.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#4ade80',
        color: '#fff',
        border: 'none',
      },
    })

    selectedIds.value = []
    showSelectedToast()
    fetchSolicitudes()
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

onMounted(() => {
  fetchSolicitudes()
})
</script>

<template>
  <section>
    <div class="m-5">
      <h1 class="text-2xl font-bold">Eliminar Evento</h1>
      <p class="text-gray-500 text-sm">
        Aquí puedes eliminar los eventos existentes.
      </p>
    </div>
    <div class="m-5 flex flex-col md:flex-row gap-2 md:items-center">
      <h1 class="text-sm">Filtro</h1>
      <Select v-model="statusFilter" class="w-full md:w-56">
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por estatus" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Aprobado">Aprobadas</SelectItem>
            <SelectItem value="Pendiente">Pendientes</SelectItem>
            <SelectItem value="Rechazado">Rechazadas</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            ><Button variant="outline" @click="selectAll"><ListPlus /></Button
          ></TooltipTrigger>
          <TooltipContent>
            <p>Seleccionar todos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            ><Button variant="outline" @click="deselectAll"
              ><ListRestart /></Button
          ></TooltipTrigger>
          <TooltipContent>
            <p>Deseleccionar todos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        variant="destructive"
        :disabled="selectedIds.length < 2"
        @click="deleteMultipleEvents"
        ><Trash2
      /></Button>
    </div>
    <div class="m-5">
      <Table :items="solicitudes" :columns="columns" :page-size="5">
        <template #cell-Select="{ item }">
          <Label class="cursor-pointer">
            <input
              type="checkbox"
              :id="`select-${item.id}`"
              :value="item.id"
              v-model="selectedIds"
              @change="showSelectedToast"
            />
          </Label>
        </template>
        <template #cell-id="{ value, item }">
          <Button @click="openDialog(item)">
            {{ value }}
          </Button>
        </template>
        <template #cell-status="{ value }">
          <Badge
            :variant="
              value === 'Pendiente'
                ? 'pending'
                : value === 'Aprobado'
                ? 'success'
                : 'destructive'
            "
            class="capitalize"
          >
            {{ value }}
          </Badge>
        </template>
      </Table>
    </div>

    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:w-full md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle> Solicitud #{{ selectedEvent?.id }} </DialogTitle>
          <DialogDescription>
            <div class="">
              <div class="mb-2">
                <strong>Evento:</strong> {{ selectedEvent?.title }}<br />
                <strong>Inicio:</strong> {{ selectedEvent?.start }}<br />
                <strong>Fin:</strong> {{ selectedEvent?.end }}<br />
                <strong>Descripción:</strong> {{ selectedEvent?.contentFull }}
              </div>
              <div v-if="selectedEvent?.profiles">
                <strong>Solicitante:</strong>
                {{ selectedEvent.profiles.first_name }}
                {{ selectedEvent.profiles.last_name }}<br />
                <strong>Entidad:</strong> {{ selectedEvent.profiles.entidad
                }}<br />
                <strong>Teléfono:</strong>
                {{ selectedEvent.profiles.phone_number }}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2">
          <Button
            variant="destructive"
            :disabled="loading"
            @click="deleteEvent(selectedEvent?.id)"
            >Eliminar</Button
          >
          <Button variant="secondary" @click="dialogOpen = false"
            >Cerrar</Button
          >
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>
