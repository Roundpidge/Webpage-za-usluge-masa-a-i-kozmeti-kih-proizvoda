<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { usetretmaniStore } from "@/stores/projektStore.js"

const store = usetretmaniStore()
const route = useRoute()
const tretman = computed(() => store.getById2(route.params.id))
</script>

<template>
  <div v-if="tretman">
    <h1 class="text-3xl">{{ tretman.naziv }}</h1>
    <ol>
        <li>Trajanje: {{ tretman.trajanje }}</li>
        <li>Cijena: {{ tretman.cijena }}</li>
    </ol>
  </div>
  <div v-else>
    <p>Tretman nije pronađen!</p>
  </div>
</template>
