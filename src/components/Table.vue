<script setup>
import { ref, computed, watch } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const props = defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  pageSize: { type: Number, default: 10 },
})

const page = ref(1)
const totalPages = computed(() =>
  Math.ceil(props.items.length / props.pageSize)
)

const pagedItems = computed(() =>
  props.items.slice(
    (page.value - 1) * props.pageSize,
    page.value * props.pageSize
  )
)

function nextPage() {
  if (page.value < totalPages.value) page.value++
}
function prevPage() {
  if (page.value > 1) page.value--
}

// Reset page if items change
watch(
  () => props.items,
  () => {
    page.value = 1
  }
)
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead
          v-for="col in columns"
          :key="col.key"
          class="px-4 py-2 text-left"
        >
          {{ col.label }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="item in pagedItems" :key="item.id">
        <TableCell v-for="col in columns" :key="col.key" class="px-4 py-2">
          <slot :name="`cell-${col.key}`" :value="item[col.key]" :item="item">
            {{ item[col.key] }}
          </slot>
        </TableCell>
      </TableRow>
      <TableRow v-if="pagedItems.length === 0">
        <TableCell
          :colspan="columns.length"
          class="text-center text-gray-400 py-4"
        >
          Sin datos para mostrar
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div class="flex justify-end items-center mt-4 gap-2">
    <Button @click="prevPage" :disabled="page === 1"><ArrowLeft /></Button>
    <span class="text-sm">Página {{ page }} de {{ totalPages }}</span>
    <Button @click="nextPage" :disabled="page === totalPages"
      ><ArrowRight
    /></Button>
  </div>
</template>
