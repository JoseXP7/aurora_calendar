<script setup>
import Calendar from '@/components/Calendar.vue'
import { useSupabase } from '@/clients/supabase'
import { ref, onMounted } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CalendarDays, ClockArrowUp, ClockArrowDown } from 'lucide-vue-next'

const { supabase } = useSupabase()

const eventos = ref([])

// const eventos = [
//   {
//     id: 1,
//     user_id: '0000-bbbb-cccc-dddd-eeeeeeeeeeee',
//     start: '2025-06-17 10:00',
//     end: '2025-06-17 11:00',
//     title: 'Secuestrar al rector',
//     class: 'azul',
//     contentFull:
//       'Secuestrar al rector de la universidad para pedir un rescate de 100 millones de pesos. No se aceptan billetes de 500.',
//     status: 'Pendiente',
//   },
//   {
//     id: 2,
//     user_id: '1010-bbbb-cccc-dddd-eeeeeeeeeeee',
//     start: '2025-06-23 08:00',
//     end: '2025-06-23 10:00',
//     title: 'Reunion de transporte',
//     class: 'violeta',
//     contentFull:
//       'Reunion con el equipo de transporte para discutir la nueva ruta del bus y los horarios de salida.',
//     status: 'Aprobado',
//   },
// ]

const dialogOpen = ref(false)
const eventSelected = ref(null)

const onEventClick = ({ event }) => {
  eventSelected.value = event
  dialogOpen.value = true
}

const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'Aprobado')

  if (error) throw error

  eventos.value = data
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <section>
    <div class="m-5">
      <h1 class="text-2xl font-bold">Calendario</h1>
    </div>
    <div class="m-5">
      <Calendar :events="eventos" :time="true" @event-click="onEventClick" />
    </div>
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ eventSelected.title }}</DialogTitle>
          <DialogDescription class="grid grid-cols-2 gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <CalendarDays /> {{ eventSelected.start.format() }}
              </div>
              <div class="flex items-center gap-2 mb-2">
                <ClockArrowUp /> Hora de inicio:
                {{ eventSelected.start.formatTime('hh:mm:am') }}
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-2">
                <CalendarDays /> {{ eventSelected.end.format() }}
              </div>
              <div class="flex items-center gap-2 mb-2">
                <ClockArrowDown /> Hora de cierre:
                {{ eventSelected.end.formatTime('hh:mm:am') }}
              </div>
            </div></DialogDescription
          >
        </DialogHeader>
        <div class="py-4">
          <p>{{ eventSelected.contentFull }}</p>
        </div>
      </DialogContent>
    </Dialog>
  </section>
</template>
