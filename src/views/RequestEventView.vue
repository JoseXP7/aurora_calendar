<script setup>
import { useSupabase } from '@/clients/supabase'
import { useUserStore } from '@/stores/userStore'
import { ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const userStore = useUserStore()
const { supabase } = useSupabase()

const loading = ref(false)
const now = computed(
  () => `${new Date().addDays(1).format('YYYY-MM-DD')}T00:00`
)

const dateStart = ref('')
const dateSFormatted = computed(() => dateStart.value.replace('T', ' '))
const dateEnd = ref('')
const dateEFormatted = computed(() => dateEnd.value.replace('T', ' '))
const title = ref('')
const color = ref('')
const descripcion = ref('')

// --- Restricción de fecha de cierre ---
const endMin = computed(() => (dateStart.value ? dateStart.value : ''))
const endMax = computed(() => {
  if (!dateStart.value) return ''
  // Extrae la fecha (YYYY-MM-DD) y concatena la hora máxima
  const day = dateStart.value.split('T')[0]
  return `${day}T23:59`
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

const requestEvent = async () => {
  const userId = userStore.user.id
  if (
    !dateStart.value ||
    !dateEnd.value ||
    !title.value ||
    !color.value ||
    !descripcion.value
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

  try {
    loading.value = true
    const evento = {
      user_id: userId,
      start: dateSFormatted.value,
      end: dateEFormatted.value,
      title: title.value,
      class: color.value,
      contentFull: descripcion.value,
      status: 'Pendiente',
    }

    const { error } = await supabase.from('events').upsert(evento)

    if (error) throw error
    toast.success('Evento solicitado con éxito.', {
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
</script>

<template>
  <section>
    <div class="m-5">
      <h1 class="text-2xl font-bold">Solicitar Evento</h1>
    </div>
    <div class="m-5">
      <form action="" autocomplete="off" @submit.prevent="requestEvent()">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-2 md:col-span-1">
            <Label for="title">Título del evento</Label>
            <Input
              id="title"
              v-model="title"
              type="text"
              placeholder="Reunión con..."
            />
          </div>
          <div class="space-y-2 md:col-span-3">
            <Label for="description">Descripción</Label>
            <Input
              id="description"
              v-model="descripcion"
              type="text"
              placeholder=""
            />
          </div>
          <div class="space-y-2 md:col-span-1">
            <Label for="date">Fecha de Inicio</Label>
            <Input
              id="date"
              v-model="dateStart"
              :min="now"
              type="datetime-local"
            />
          </div>
          <div class="space-y-2 md:col-span-1">
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
          <div class="space-y-2 md:col-span-1">
            <Label for="color">Color</Label>
            <Select id="color" v-model="color">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Selecciona un color" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="rojo">Rojo 🔴</SelectItem>
                  <SelectItem value="naranja">Naranja 🟠</SelectItem>
                  <SelectItem value="amarillo">Amarillo 🟡</SelectItem>
                  <SelectItem value="verde">Verde 🟢</SelectItem>
                  <SelectItem value="azul">Azul 🔵</SelectItem>
                  <SelectItem value="violeta">Violeta 🟣</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button class="mt-4 w-full md:w-auto" type="submit" :disabled="loading"
          >Solicitar Evento</Button
        >
      </form>
    </div>
  </section>
</template>
