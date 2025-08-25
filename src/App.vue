<script setup>
import {ref} from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import gumb from './components/gumb.vue'
import backgroundImg from '@/assets/Backround.jpg' 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase.js'
import { useUserStore } from './stores/projektStore.js';

const router = useRouter()
const isAdmin=ref(false);
const user = ref(null);

onAuthStateChanged(auth, (currentUser) => {
 if (currentUser) {
 user.value = currentUser;

 } else {
 user.value = null;
 }
});

const {uloga}=useUserStore();

const checkRole = async()=> {
   const uloga = await nadiUlogu(); 
   if(uloga.value==="admin"){
    return isAdmin.value=true;
   }
   else{
    return isAdmin.value=false
   }
}
</script>

<template>
  
  <div class="min-h-screen flex flex-col bg-cover bg-center" :style="{ backgroundImage: `url(${backgroundImg})` }">

        <div class="absolute inset-0 bg-white/65 "></div>
    <nav class="relative flex gap-4 p-4 bg-[#e0fad9]">
 <span v-if="!user" class="text-rose-600 text-sm"> Nema prijavljenog korisnika! </span>
 <span v-else class="text-emerald-600 text-sm"> Prijavljen korisnik: <b>{{ user.email }}</b></span>
      <RouterLink to="/"><gumb>Početna</gumb></RouterLink>
      <RouterLink to="/about"><gumb>O nama</gumb></RouterLink>
      <RouterLink to="/products"><gumb>Proizvodi</gumb></RouterLink>
      <RouterLink to="/tretmani"><gumb>Tretmani</gumb></RouterLink>
      <RouterLink to="/registerLogin"><gumb>Registracija i prijava</gumb></RouterLink>
      <RouterLink v-if="user && !checkRole" :to="{ name: 'korisnik', params: {email: user.email} }"><gumb>Korisnicni racun</gumb></RouterLink>
      <RouterLink v-if="user && checkRole" :to="{ name: 'adminPage', params: {email: user.email} }"><gumb>Admin racun</gumb></RouterLink>
    </nav>

    <main class="relative flex-grow">
      <RouterView />
    </main>

    <footer class="relative bg-[#c2e9b7]  text-center p-4 mt-8">
      © 2025 No Stress Kozmetički Salon
    </footer>
  </div>
</template>
