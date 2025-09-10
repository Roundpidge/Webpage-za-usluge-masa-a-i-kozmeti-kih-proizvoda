<script setup>
import naslov from '@/components/naslov.vue'
import tekst from '@/components/tekst.vue'
</script>
<template>
    <naslov>Dobrodošli!</naslov>
  <img src="@/assets/Tranquility-Spa-Rocks.jpg" class="max-h-70 hero-img p-4">
  <tekst>Nudimo razne kozmetičke proizvode kao i bezgotovinsku kupnju.<br></br> Uz proizvode nudimo i usluge masaža prilagođene za sve potrebe.<br></br>Dodatne informacija za salon se nalaze pod <strong>"O nama"</strong></tekst><br>
  <span class="text-[#7a472f] text-xl">! Ako se želite naručiti na neki određeni tretman ili želite kupiti proizvod, nastavite do <strong>"Registracija i prijava" !</strong></span>

</template>

<style scoped>
.hero-img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}
</style>
