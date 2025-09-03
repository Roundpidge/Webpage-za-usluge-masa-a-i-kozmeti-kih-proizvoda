<script setup>
import { RouterLink} from 'vue-router'
import { useTretmaniStore } from "@/stores/projektStore.js"
const storeT = useTretmaniStore();

</script>
<template>
  <div class="border-r border-blue-400">
    <RouterLink v-for="tretman in storeT.tretmani" :key="tretman?.id" :to="`/tretmanDetaljno/${tretman.id}`">
    <div class=" w-fit flex justify-center m-2 rounded hover:text-orange-400">
      {{ tretman.naziv }} <span class="border-r"></span>{{ tretman.cijena }}
    </div>
  </RouterLink>
</div>
  <h1 class="text-gray-200">Propustili ste popuste na tretmane i proizvode? Registracijom ili prijavom svojeg računa možete omogućiti primanje ranih obavijesti o nadolazećim popustima i novostima kako biste bili u toku do danas</h1>

</template>

<style scoped></style>
