<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: null, required: false },
})
</script>

<template>
  <th
    data-slot="table-head"
    :class="
      cn(
        'text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-normal break-words [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        props.class
      )
    "
  >
    <slot />
  </th>
</template>
