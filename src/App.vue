<script setup>
import {ref, computed} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { onAuthStateChanged, reload } from 'firebase/auth';
import { auth } from '@/firebase.js'
import { useUserStore } from './stores/projektStore.js';
import gumb from '@/components/gumb.vue'

const isAdmin=ref(false);
const user = ref(null);

const storeUser=useUserStore();

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
</script>
<template>    
<div class="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen flex flex-col">
 <nav class="relative flex gap-4 p-4 bg-[#affa94] rounded-b-3xl">
  <div class="flex items-center text-sm">
    <span v-if="!user" class="text-[#b52424] text-sm">
      Nema prijavljenog korisnika!
    </span>
    <div v-else class="flex flex-col text-[#24b550] text-sm">
      <span>Prijavljen korisnik: </span>
      <strong>{{ user.email }}</strong>
  </div>
  </div>
    <RouterLink to="/"><gumb>Početna</gumb></RouterLink>
    <RouterLink to="/about"><gumb>O nama</gumb></RouterLink>
    <RouterLink to="/products"><gumb>Proizvodi</gumb></RouterLink>
    <RouterLink to="/tretmani"><gumb>Tretmani</gumb></RouterLink>
    <RouterLink to="/registerLogin"><gumb>Registracija i prijava</gumb></RouterLink>
    <RouterLink v-if="user && !isAdmin" :to="{ name: 'korisnik', params: { email: user.email } }" ><gumb>Korisnički račun</gumb></RouterLink>
    <RouterLink v-if="user && isAdmin" :to="{ name: 'adminPage', params: { email: user.email } }"><gumb>Admin račun</gumb></RouterLink>
    <img v-if="verified" src="@/assets/leaves.png" class="max-h-15 max-w-15">
    <img v-else-if="user && !verified" src="@/assets/leaves2.png" class="max-h-15 max-w-15">
  </nav>
  <main class="relative flex-grow">
    <RouterView />
  </main>
  <footer class="relative bg-[#affa94] text-center text-[#1b7511] p-4 mt-auto">
    © 2025 No Stress Kozmetički Salon
  </footer>
  </div>
</template>
