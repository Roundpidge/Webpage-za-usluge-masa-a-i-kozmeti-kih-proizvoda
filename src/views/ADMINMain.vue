<script setup>
import {ref, computed} from 'vue'
import { useRouter } from "vue-router";
import { useProductsStore } from "@/stores/projektStore.js"
import Swal from 'sweetalert2';

const router=useRouter();
const store=useProductsStore(); 
const isProizvod = computed(() => odabir.value === 'proizvod')
const isTretman  = computed(() => odabir.value === 'tretman')
const odabir=ref('proizvod')

// potrebno imati skinut paket sweetalert2 !!

const  obrisiProizvod = async(id, naziv)=> {
  const {isConfirmed} = await Swal.fire({
  title: `"Jeste li sigurni da zelite obrisati proizvod ${naziv}?"`,
  text: "Nece biti moguce ponistiti ovu radnju!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Obrisi"
})
  if (isConfirmed) {
  await store.izbrisiProizvod(id)
    Swal.fire({
      title: "Obrisano!",
      text: "Proizvod je uspjesno izbrisan",
      icon: "success"
    });
  }
}

</script>

<template>
   <span>Dobrodosli admin! </span>  
   <Label>Što želite dalje? </Label>
   <select name="odabiri" v-model="odabir">
    <option value="proizvod">Pregled proizvoda</option>
    <option value="tretman">Pregled tretmana</option>
   </select>
   <!--PROIZVODI-->
 <div class="border-r border-blue-400" v-if="isProizvod && !isTretman">
    <ol class=" w-fit flex justify-center m-2 rounded ">
      <li v-for="proizvod in store.proizvodi" :key="proizvod?.id">
      <RouterLink :to="`/proizvodDetaljno/${proizvod.id}`"class="hover:text-orange-400">{{ proizvod.naziv }} | {{ proizvod.cijena }} €</RouterLink>
      <button @click="obrisiProizvod(proizvod.id, proizvod.naziv)"class="m-2">Izbriši proizvod</button>
      </li>
    </ol>
</div>

<!--TRETMANI-->
  <div v-if="!isProizvod && isTretman">
    <ol class=" w-fit flex justify-center m-2 rounded hover:text-orange-400">
      <li v-for="tretman in store.tretmani" :key="tretman?.id">
      <RouterLink :to="`/tretmanDetaljno/${tretman.id}`">{{ tretman.naziv }} | {{ tretman.cijena }} €</RouterLink>
      </li>
    </ol>
  </div>


</template>
