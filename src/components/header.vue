<script setup>

import { ref } from 'vue';
const proizvodi=ref([
{id:1, naziv:'hidratantna krema za lice', kolicina:'250 g',  cijena:5.50, dostupnost:10},
{id:2, naziv:'pjena za lice',             kolicina:'150 ml', cijena:7.00, dostupnost: 10},
{id:3, naziv:'pasta za njegu stopala',    kolicina:'100 g',  cijena:8.50, dostupnost: 5},
]);

</script>

<template>
    <h1 class="text-xl text-red-600">! Proizvodi na <span class="text-3xl">akciji!</span> </h1>
    <div class="flex gap-4 flex-wrap">
         <RouterLink v-for="proizvod in proizvodi" :key="proizvod.id" :to="`/proizvodDetaljno/${proizvod.id}`">
        <div  class=" w-fit flex justify-center  p-2  bg-orange-300 hover:text-orange-400">{{ proizvod.naziv }}</div>
        </RouterLink>
    </div>
    <hr class="border-1 border-blue-400">
</template>

<style scoped>
</style>