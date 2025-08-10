<script setup>
import {ref} from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import gumb from './components/gumb.vue'
import backgroundImg from '@/assets/Backround.jpg' 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase.js'

const router = useRouter()

const user = ref(null)
onAuthStateChanged(auth, (currentUser) => {
 if (currentUser) {
 user.value = currentUser;
 } else {
 user.value = null;
 }
});

const logout = async () => {
  try {
    await signOut(auth)
    router.replace('/logout') 
  } catch (err) {
    console.error('Greška pri odjavi:', err)
  }
}

</script>

<template>
  
  <div class="min-h-screen flex flex-col bg-cover bg-center" :style="{ backgroundImage: `url(${backgroundImg})` }">

        <div class="absolute inset-0 bg-white/50 "></div>
    <nav class="relative flex gap-4 p-4 bg-blue-400">
 <span v-if="!user" class="text-rose-600 text-sm"> Nema prijavljenog korisnika! </span>
 <span v-else class="text-emerald-600 text-sm"> Prijavljen korisnik: <b>{{ user.email }}</b></span>
      <RouterLink to="/"><gumb>Početna</gumb></RouterLink>
      <RouterLink to="/about"><gumb>O nama</gumb></RouterLink>
      <RouterLink to="/products"><gumb>Proizvodi</gumb></RouterLink>
      <RouterLink to="/tretmani"><gumb>Tretmani</gumb></RouterLink>
      <RouterLink to="/register"><gumb>Registracija</gumb></RouterLink>
      <RouterLink to="/login"><gumb>Prijava</gumb></RouterLink>
      <button @click.prevent="logout"><gumb>Odjava</gumb></button>
    </nav>

    <main class="relative flex-grow">
      <RouterView />
    </main>

    <footer class="relative bg-gradient-to-r from-green-200 via-orange-200 to-green-200  text-center p-4 mt-8">
      © 2025 No Stress Kozmetički Salon
    </footer>
  </div>
</template>
