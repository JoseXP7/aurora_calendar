<script setup>
import { VueCal } from 'vue-cal'
import 'vue-cal/style'

const props = defineProps({
  events: { type: Array, default: () => [] },
  time: { type: Boolean, default: false },
  // Agrega aquí cualquier prop soportada por VueCal
})
</script>

<template>
  <VueCal
    view="month"
    :views-bar="false"
    locale="es"
    :events="events"
    events-on-month-view
    :views="{ days: { cols: 5, rows: 1 }, month: {} }"
  />
</template>

<style>
.vuecal {
  --vuecal-primary-color: #6c6db2;
  .vuecal__scrollable--month-view {
    .vuecal__event {
      height: 15px;
      margin-top: 1px;
    }
    .vuecal__event-details {
      font-size: 11px;
      white-space: nowrap;
      padding: 0;
    }

    .vuecal__cell--has-events {
      flex-direction: row-reverse;
      overflow: hidden;
      justify-content: flex-start;
    }

    .vuecal__cell--has-events .vuecal__cell-date {
      align-self: flex-start;
    }
    .vuecal__cell--has-events {
      background-color: #fffacda8;
    }

    .vuecal__event {
      color: #fff;
      border: 1px solid;
    }
    .vuecal__event.rojo {
      background-color: #e81c2b;
    }
    .vuecal__event.naranja {
      background-color: #f4891e;
    }
    .vuecal__event.amarillo {
      background-color: #eace2a;
    }
    .vuecal__event.verde {
      background-color: #0ca34f;
    }
    .vuecal__event.azul {
      background-color: #449fe3;
    }
    .vuecal__event.violeta {
      background-color: #6a3499;
    }
  }
}
</style>
