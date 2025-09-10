<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useTretmaniStore } from "@/stores/projektStore.js"
import {onAuthStateChanged} from 'firebase/auth'
import { auth } from '@/firebase.js'
import placeholder from '@/assets/placeholder.jpeg'
import naslov from '@/components/naslov.vue'
import tekst from '@/components/tekst.vue'
import gumb2 from '@/components/gumbVanNavbar.vue'

const storeT = useTretmaniStore()
const route = useRoute()
const tretman = computed(() => storeT.getById2(route.params.id))
const user=ref(null)
const isAdmin=ref(false);

onAuthStateChanged(auth, async (currentUser) => {
  user.value = currentUser

  if (currentUser) {
    try { await reload(currentUser) } catch {}
    
    try{ 
    const role = await storeUser.nadiUlogu()
    isAdmin.value = role === 'admin'
  }catch{isAdmin.value=false}
  } else {
    isAdmin.value = false
  }
})

const verified = computed(() => user.value?.emailVerified === true)

onAuthStateChanged(auth, (currentUser) => {
 if (currentUser) {
 user.value = currentUser;

 } else {
 user.value = null;
 }
});

</script>

<template>
  <div v-if="tretman">
<div class="text-center px-6">
    <naslov>{{ tretman.naziv }}</naslov>
    <tekst>
    <img :src="tretman.slika || placeholder" alt="slika" class="max-h-20 inline-block ml-2" />
    <br></br>
    <ol>
        <li>Trajanje: {{ tretman.trajanje }}</li>
        <li>Cijena: {{ tretman.cijena }}</li>
    </ol>
</tekst>
<br></br>
    <a v-if="user && verified || isAdmin" href="https://docs.google.com/forms/d/e/1FAIpQLSf-PfQg1hO64jKMxPXrskUyo7oXCnRf7qcJtwkA3mNhj7A2Sw/viewform?usp=header" ><gumb2>Naruci se</gumb2></a>
<div v-else>Verificirani korisnici mogu rezervirati termin, za verifikaciju nastavite do "Korisnički račun", ukoliko niste prijavljeni prvo odite do "Registracija i prijava" i automatski nakon registracije ili prijave će vas prebaciti na korisnički račun</div>
</div>
  </div>
  <div v-else>
    <p>Tretman nije pronađen!</p>
  </div>

</template>
