<script setup>
import { useProductsStore } from "@/stores/projektStore.js"
import naslov from '@/components/naslov.vue'
import tekst from '@/components/tekst.vue'
const store = useProductsStore();
</script>

<template>
    <naslov>Proizvodi u ponudi</naslov>
  <div class="flex justify-center my-6">
    <table>
      <tbody>
        <tr v-for="proizvod in store.proizvodi" :key="proizvod?.id">
          <td class="p-3 text-center">
            <tekst>
              <RouterLink :to="`/proizvodDetaljno/${proizvod.id}`" class="hover:text-[#24b550] font-medium">
                {{ proizvod.naziv }}
              </RouterLink>
              <div class="text-sm text-gray-700">
                {{ proizvod.cijena }} €
              </div>
            </tekst>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
