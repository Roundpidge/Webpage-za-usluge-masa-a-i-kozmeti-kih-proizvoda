<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useProductsStore, useKosaricaStore, useUserStore } from "@/stores/projektStore.js"
import {onAuthStateChanged} from 'firebase/auth'
import { auth } from '@/firebase.js'
import Swal from 'sweetalert2'
import placeholder from '@/assets/placeholder.jpeg' 
import naslov from '@/components/naslov.vue'
import tekst from '@/components/tekst.vue'
import gumb2 from '@/components/gumbVanNavbar.vue'

const store = useProductsStore()
const userStore=useUserStore()
const cart=useKosaricaStore()

const route = useRoute()
const router=useRouter()
const user=ref(null)

const id = computed(() => Number((route.params.id)))
const proizvod = computed(() => store.getById(id.value))
const kol=ref(1)

function povecajKol(){
kol.value=Math.max(1, Number(kol.value)+1)
}

function smanjiKol(){
kol.value=Math.max(1, Number(kol.value)-1)
}

async function dodajuKosaricu(){
  const p=proizvod.value
  if(!p)return
  const k=Math.max(1, Number(kol.value) || 1)

cart.dodajUKosaricu(proizvod.value.id, kol.value)

  const {isConfirmed} = await Swal.fire({
  title: `Dodali ste ${p.naziv} x${k}`,
  icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Pogledaj košaricu',
    cancelButtonText: 'Nastavi kupovati',
}) 

if(!isConfirmed) return
  let role
  try {role= await userStore.nadiUlogu?.()} catch{role=undefined}
  if(role==='admin'){
    await router.push({ name: 'adminPage', params:{email: user.value?.email} }) 
  } else{
    await router.push({ name: 'korisnik', params:{email: user.value?.email}, query: { tab: 'kosarica' } } )
  }
  
};

onAuthStateChanged(auth, (currentUser) => {
 if (currentUser) {
 user.value = currentUser;

 } else {
 user.value = null;
 }
});

</script>

<template>
  <div v-if="proizvod">
    <div class="text-center px-6">
    <naslov class="text-2xl">{{ proizvod.naziv }}</naslov>
    <tekst>
    <img :src="proizvod.slika || placeholder" alt="slika" class="max-h-20 inline-block ml-2" />
    <ol>
        <li class="m-2">Količina: {{ proizvod.kolicina }}</li>
        <li class="m-2">Cijena: {{ proizvod.cijena }}</li>
    </ol>
    </tekst>
    
<div v-if="user" class="flex flex-col items-center">
  <div class="bg-[#affa94] w-fit rounded-xl px-4 py-3 flex flex-col items-center mb-10">
    <div class="inline-flex items-center gap-4 text-xl">
      <button @click="smanjiKol()" class="w-8 h-8 flex items-center justify-center hover:text-[#1b7511] text-3xl mb-4">-</button>
      <span class="min-w-6 text-center mb-4">{{ kol }}</span>
      <button @click="povecajKol()" class="w-8 h-8 flex items-center justify-center  hover:text-[#1b7511] text-3xl mb-4">+</button>
    </div>
      <gumb2 @click="dodajuKosaricu()">Dodaj u košaricu</gumb2>
 
  </div>
</div>
<div v-else>Prijavljeni korisnici mogu dodati proizvod u  košaricu, za registraciju ili prijavu odite do "Registracija i prijava" i automatski nakon registracije ili prijave će vas prebaciti na korisnički račun</div>

    </div>
  </div>
  <div v-else>
    <p>Proizvod nije pronađen!</p>
  </div>
</template>
