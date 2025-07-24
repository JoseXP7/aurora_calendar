<script setup>
import Table from '@/components/Table.vue'
import { useSupabase } from '@/clients/supabase'
import { ref, onMounted, watch } from 'vue'
import { Badge } from '@/components/ui/badge'
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

const solicitudes = ref([])
const dialogOpen = ref(false)
const selectedEvent = ref(null)
const loading = ref(false)
const statusFilter = ref('Pendiente')

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

const openDialog = (item) => {
  selectedEvent.value = item
  dialogOpen.value = true
}

const handleDecision = async (status) => {
  if (!selectedEvent.value) return
  try {
    const { error } = await supabase
      .from('events')
      .update({ status })
      .eq('id', selectedEvent.value.id)
    if (error) throw error

    if (status === 'Rechazado') {
      toast.success('Solicitud Rechazada.', {
        position: 'bottom-right',
        duration: 5000,
        style: {
          backgroundColor: '#4ade80',
          color: '#fff',
          border: 'none',
        },
      })
    } else if (status === 'Aprobado') {
      toast.success('Solicitud Aceptada.', {
        position: 'bottom-right',
        duration: 5000,
        style: {
          backgroundColor: '#4ade80',
          color: '#fff',
          border: 'none',
        },
      })
    }

    dialogOpen.value = false
    await fetchSolicitudes()
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
      <h1 class="text-2xl font-bold">Solicitudes</h1>
      <p class="text-gray-500 text-sm">
        Aquí puedes aceptar las solicitudes del personal y los Centros de
        Estudiantes
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
            <SelectItem value="Pendiente">Pendientes</SelectItem>
            <SelectItem value="Aprobado">Aprobadas</SelectItem>
            <SelectItem value="Rechazado">Rechazadas</SelectItem>
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
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Solicitud #{{ selectedEvent?.id }} </DialogTitle>
          <DialogDescription>
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
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2">
          <Button
            variant="success"
            @click="handleDecision('Aprobado')"
            :disabled="loading"
            v-if="statusFilter == 'Pendiente'"
            >Aceptar</Button
          >
          <Button
            variant="destructive"
            @click="handleDecision('Rechazado')"
            :disabled="loading"
            v-if="statusFilter == 'Aprobado' || statusFilter == 'Pendiente'"
            >{{
              statusFilter == 'Aprobado' ? 'Cancelar Evento' : 'Rechazar'
            }}</Button
          >
          <Button variant="secondary" @click="dialogOpen = false"
            >Cerrar</Button
          >
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>
