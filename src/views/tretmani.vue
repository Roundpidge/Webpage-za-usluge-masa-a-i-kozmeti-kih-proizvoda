<script setup>
import { RouterLink} from 'vue-router'
import { useTretmaniStore } from "@/stores/projektStore.js"
import naslov from '@/components/naslov.vue'
import tekst from '@/components/tekst.vue'
const storeT = useTretmaniStore();

</script>
<template>
  <naslov>Tretmani u ponudi</naslov>
 <div class="flex justify-center my-6">
    <table>
      <tbody>
        <tr v-for="tretman in storeT.tretmani" :key="tretman?.id">
          <td class="p-3 text-center">
            <tekst>
              <RouterLink
                :to="`/tretmanDetaljno/${tretman.id}`"
                class="hover:text-[#24b550] font-medium">
                {{ tretman.naziv }}
              </RouterLink>
              <div class="text-sm text-gray-700">
                {{ tretman.cijena }} €
              </div>
            </tekst>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>



 

<style scoped></style>
