
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useProductsStore, useKosaricaStore, useUserStore } from "@/stores/projektStore.js"
import {onAuthStateChanged} from 'firebase/auth'
import { auth } from '@/firebase.js'
import Swal from 'sweetalert2'
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
    <h1 class="text-3xl">{{ proizvod.naziv }}</h1>
    <ol>
        <li>Količina: {{ proizvod.kolicina }}</li>
        <li>Cijena: {{ proizvod.cijena }}</li>
    </ol>
    
    <div v-if="user"><button @click="smanjiKol()">-</button>{{ kol }}<button @click="povecajKol()">+</button>
    <button @click=" dodajuKosaricu()">Dodaj u košaricu</button>
    </div>
  </div>
  <div v-else>
    <p>Proizvod nije pronađen!</p>
  </div>
</template>
