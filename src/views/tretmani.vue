<script setup>
import { RouterLink, RouterView } from 'vue-router'
import zaglavlje from '../components/header.vue';
import { usetretmaniStore } from "@/stores/projektStore.js"

const store = usetretmaniStore();

</script>
<template>
  <zaglavlje></zaglavlje>
  <div class="border-r border-blue-400">
  <RouterLink v-for="tretman in store.tretmani" :key="tretman?.id" :to="`/tretmanDetaljno/${tretman.id}`">
    <div class=" w-fit flex justify-center m-2 rounded hover:text-orange-400">
      {{ tretman.naziv }} <span class="border-r"></span>{{ tretman.cijena }}
    </div>
  </RouterLink>
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSf-PfQg1hO64jKMxPXrskUyo7oXCnRf7qcJtwkA3mNhj7A2Sw/viewform?usp=header" class="border-orange-400 border-3 rounded-lg bg-orange-200 mb-3 p-2">Naruci se</a>
</div>
  <h1 class="text-gray-200">Propustili ste popuste na tretmane i proizvode? Registracijom ili prijavom svojeg računa možete omogućiti primanje ranih obavijesti o nadolazećim popustima i novostima kako biste bili u toku do danas</h1>

</template>

<style scoped></style>

