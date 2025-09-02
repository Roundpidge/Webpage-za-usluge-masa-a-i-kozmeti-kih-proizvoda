<script setup>
import {ref, computed} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import gumb from './components/gumb.vue'
import { onAuthStateChanged, reload } from 'firebase/auth';
import { auth } from '@/firebase.js'
import { useUserStore } from './stores/projektStore.js';

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
 <nav class="relative flex gap-4 p-4 bg-[#e0fad9]">
    <span v-if="!user" class="text-rose-600 text-sm">
      Nema prijavljenog korisnika!
    </span>
    <span v-else class="text-emerald-600 text-sm">
      Prijavljen korisnik: <b>{{ user.email }}</b>
    </span>

    <span v-if="user && verified" class="text-green-600"> verificiran</span>
    <span v-else-if="user && !verified" class="text-red-600"> nije verificiran</span>

    <RouterLink to="/"><gumb>Početna</gumb></RouterLink>
    <RouterLink to="/about"><gumb>O nama</gumb></RouterLink>
    <RouterLink to="/products"><gumb>Proizvodi</gumb></RouterLink>
    <RouterLink to="/tretmani"><gumb>Tretmani</gumb></RouterLink>
    <RouterLink to="/registerLogin"><gumb>Registracija i prijava</gumb></RouterLink>
    <RouterLink v-if="user && !isAdmin" :to="{ name: 'korisnik', params: { email: user.email } }" ><gumb>Korisnički račun</gumb></RouterLink>
    <RouterLink v-if="user && isAdmin" :to="{ name: 'adminPage', params: { email: user.email } }"><gumb>Admin račun</gumb></RouterLink>
  </nav>
  <main class="relative flex-grow">
    <RouterView />
  </main>
  <footer class="relative bg-[#c2e9b7] text-center p-4 mt-8">
    © 2025 No Stress Kozmetički Salon
  </footer>
</template>
