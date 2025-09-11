<script setup>
import { ref, onMounted } from 'vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, getAuth, deleteUser } from 'firebase/auth'
import { auth,  googleProvider} from '@/firebase.js'
import { RouterLink, useRouter } from "vue-router";
import {db} from '@/firebase.js'
import {doc, setDoc, serverTimestamp } from "firebase/firestore"
import naslov from '@/components/naslov.vue'
import gumb2 from '@/components/gumbVanNavbar.vue'

const router = useRouter();

const email = ref('')
const password = ref('')

const emailPrijava=ref('')
const passwordPrijava=ref('')

//REGISTRACIJA
const response = ref({ error: false, message: '' })
const register = async () => {
 try {
 const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
 response.value.error = false;
 const user=userCredential.user;


 // OVO ŠALJE PODAKTE U USERS DATABASE, DOBRO DODĐE KASNIJE ZA ADMIN LOGIN, DA SE PROVJERI PO ULOZI TKO JE I TKO NIJE ADMIN
await setDoc(doc(db, "users", user.uid), {
 email: email.value,
 uloga: "user",
 clan_od: serverTimestamp(),
 zadnja_aktivnost: serverTimestamp()
});

 response.value.message = 'Korisnik registriran i user document napravljen! ';

await router.replace({ name: 'korisnik', params: {email: email.value} })
return

 } catch (error) {
 response.value.error = true;
 response.value.message = 'Greška pri registraciji: ' + error.message;
deleteUser(auth.currentUser); 
 }
};

//LOGIN
const login = async () => {
 try {
 const userCredential = await signInWithEmailAndPassword(auth, emailPrijava.value, passwordPrijava.value);
 response.value.error = false;
 response.value.message = 'Korisnik prijavljen: ';

await router.replace({ name: 'korisnik', params: { email: emailPrijava.value } })
return

 } catch (error) {
 response.value.error = true;
 response.value.message = 'Greška pri prijavi: ' + error.message;
 }
};

//GOOGLE PRIJAVA
const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider)
    response.value = { error: false, message: 'Prijava s Googleom uspješna.' }
  } catch (error) {
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, googleProvider)
    } else {
      response.value = { error: true, message: `Greška pri Google prijavi: ${err.message}` }
    }
  }
}

//Dohvaća podatke odmah čim se komponenta pojavi
onMounted(async () => {
  try { const result = await getRedirectResult(auth)
    if (result?.user) {
      response.value = { error: false, message: `Prijavljeni ste kao: ${result.user.email}` }
    }
  } catch (err) {
    response.value = { error: true, message: `Greška pri redirectu: ${err.message}` }
  }
})

const stilInputa = ref('bg-[#affa94] rounded-sm mb-3 p-2 w-full max-w-md');
const stilForme  = ref('flex flex-col items-start text-[#1b7511] mt-2 p-2');
</script>

<template>
  <div class="flex flex-col items-center gap-10">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
      <!-- REGISTRACIJA  -->
      <form :class="stilForme" @submit.prevent="register">
        <naslov>Registracija</naslov>

        <label class="mt-2">Email:</label>
        <input :class="stilInputa" v-model="email" type="email" placeholder="naziv@gmail.com" />

        <label>Lozinka:</label>
        <input :class="stilInputa" v-model="password" type="password" placeholder="Upisite lozinku" />

        <gumb2 type="submit" class="mt-4">Registriraj se</gumb2>

        <span class="mt-2" :class="response.error ? 'text-rose-600' : 'text-emerald-600'">
          {{ response.message }}
        </span>
      </form>

      <!-- PRIJAVA  -->
      <form :class="stilForme + ' md:border-l-4 md:border-[#9ee783] md:pl-12'" @submit.prevent="login">
        <naslov>Prijava</naslov>

        <label class="mt-2">Email:</label>
        <input :class="stilInputa" v-model="emailPrijava" type="email" placeholder="naziv@gmail.com" />

        <label>Lozinka:</label>
        <input :class="stilInputa" v-model="passwordPrijava" type="password" placeholder="Upisite lozinku" />

        <gumb2 type="submit" class="mt-4">Prijavi se</gumb2>

        <span class="mt-2" :class="response.error ? 'text-rose-600' : 'text-emerald-600'">
          {{ response.message }}
        </span>
      </form>
    </div>


<div class="flex gap-4 justify-start mt-4">
  <gumb2 class="w-40 h-12 flex items-center justify-center" @click="loginWithGoogle()">
    Google prijava
  </gumb2>
  <RouterLink to="/admin">
    <gumb2 class="w-40 h-12 flex items-center justify-center">
      ADMIN login
    </gumb2>
  </RouterLink>
</div>
    <span class="text-[#7a472f] text-xl text-center max-w-4xl">
      <strong>!</strong> Mogu se prijaviti samo postojeći korisnici; ako nemate račun,
      registrirajte se ili se prijavite Google računom<strong>!</strong>
    </span>
  </div>
</template>


<style scoped>
</style>
