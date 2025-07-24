<script setup>
import Table from '@/components/Table.vue'
import { useSupabase } from '@/clients/supabase'
import { ref, onMounted, watch, computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { toast } from 'vue-sonner'

const { supabase } = useSupabase()

const now = computed(
  () => `${new Date().addDays(1).format('YYYY-MM-DD')}T00:00`
)

const dateStart = ref('')
const dateSFormatted = computed(() => dateStart.value.replace('T', ' '))
const dateEnd = ref('')
const dateEFormatted = computed(() => dateEnd.value.replace('T', ' '))

const solicitudes = ref([])
const dialogOpen = ref(false)
const selectedEvent = ref(null)
const loading = ref(false)
const statusFilter = ref('Aprobado')

// --- Restricción de fecha de cierre ---
const endMin = computed(() => (dateStart.value ? dateStart.value : ''))
const endMax = computed(() => {
  if (!dateStart.value) return ''
  // Extrae la fecha (YYYY-MM-DD) y concatena la hora máxima
  const day = dateStart.value.split('T')[0]
  return `${day}T23:59`
})

// Define las columnas a mostrar
const columns = [
  { key: 'id', label: 'Número' },
  { key: 'user_id', label: 'ID del Solicitante' },
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
})

// Si la fecha de cierre se sale del rango, la resetea
watch([dateStart, dateEnd], () => {
  if (dateEnd.value && dateStart.value) {
    const min = endMin.value
    const max = endMax.value
    if (dateEnd.value < min || dateEnd.value > max) {
      dateEnd.value = ''
    }
  }
})

const modifyEvent = async () => {
  if (dateEnd.value < dateStart.value) {
    toast.error('La hora de cierre no puede ser menor que la de inicio.', {
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

  if (!dateStart.value || !dateEnd.value) {
    toast.error('Por favor, completa ambas fechas.', {
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
      .update({
        start: dateSFormatted.value,
        end: dateEFormatted.value,
      })
      .eq('id', selectedEvent.value.id)

    if (error) throw error

    toast.success('Evento modificado.', {
      position: 'bottom-right',
      duration: 5000,
      style: {
        backgroundColor: '#4ade80',
        color: '#fff',
        border: 'none',
      },
    })

    fetchSolicitudes()
    dialogOpen.value = false
    dateStart.value = ''
    dateEnd.value = ''
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

const openDialog = (item) => {
  selectedEvent.value = item
  dialogOpen.value = true
  dateStart.value = ''
  dateEnd.value = ''
}

onMounted(() => {
  fetchSolicitudes()
})
</script>

<template>
  <section>
    <div class="m-5">
      <h1 class="text-2xl font-bold">Modificar Evento</h1>
      <p class="text-gray-500 text-sm">
        Aquí puedes modificar los eventos existentes.
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
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div class="m-5">
      <Table :items="solicitudes" :columns="columns" :page-size="10">
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
          <!--La grid separa en dos columnas-->
          <DialogDescription class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <form
              id="modify-date"
              class="text-black"
              @submit.prevent="modifyEvent()"
              autocomplete="off"
            >
              <h2 class="text-lg font-bold">Modificar fecha</h2>
              <div class="space-y-2 mb-2">
                <Label for="date">Fecha de Inicio</Label>
                <Input
                  id="date"
                  v-model="dateStart"
                  :min="now"
                  type="datetime-local"
                />
              </div>
              <div class="space-y-2">
                <Label for="dateEnd">Hora de Cierre</Label>
                <Input
                  id="dateEnd"
                  v-model="dateEnd"
                  :min="endMin"
                  :max="endMax"
                  :disabled="!dateStart"
                  type="datetime-local"
                />
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2">
          <Button
            variant="success"
            :disabled="loading"
            type="submit"
            form="modify-date"
            >Aceptar</Button
          >
          <Button variant="secondary" @click="dialogOpen = false"
            >Cerrar</Button
          >
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>
