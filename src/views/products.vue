<script setup>
import { useProductsStore } from "@/stores/projektStore.js"
const store = useProductsStore();
</script>
<template>
<div class="border-r border-blue-400">
  <RouterLink v-for="proizvod in store.proizvodi" :key="proizvod?.id" :to="`/proizvodDetaljno/${proizvod.id}`">
    <ol class=" w-fit flex justify-center m-2 rounded hover:text-orange-400">
      <li>{{ proizvod.naziv }} | {{ proizvod.cijena }} €</li>
    </ol>
  </RouterLink>
</div>
<h1 class="text-gray-200">Propustili ste popuste na tretmane i proizvode? Registracijom ili prijavom svojeg računa možete omogućiti primanje ranih obavijesti o nadolazećim popustima i novostima kako biste bili u toku do danas</h1>
</template>
<style scoped></style>
