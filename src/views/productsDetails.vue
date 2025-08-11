<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useproductsStore } from "@/stores/projektStore.js"

const store = useproductsStore()
const route = useRoute()

const proizvod = computed(() => store.getById(route.params.id))
</script>

<template>
  <div v-if="proizvod">
    <h1 class="text-3xl">{{ proizvod.naziv }}</h1>
    <ol>
        <li>Količina: {{ proizvod.kolicina }}</li>
        <li>Cijena: {{ proizvod.cijena }}</li>
    </ol>
  </div>
  <div v-else>
    <p>Proizvod nije pronađen!</p>
  </div>
</template>
