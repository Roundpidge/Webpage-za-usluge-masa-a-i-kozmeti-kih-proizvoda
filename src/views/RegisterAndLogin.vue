<script setup>
import { ref, onMounted } from 'vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  signInWithPopup, signInWithRedirect, getRedirectResult, getAuth, GoogleAuthProvider, deleteUser } from 'firebase/auth'
import { auth,  googleProvider} from '@/firebase.js'
import { RouterLink, useRouter } from "vue-router";
import {db} from '@/firebase.js'
import {doc, setDoc, serverTimestamp } from "firebase/firestore"
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
deleteUser(auth.currentUser); //brisanje korisnika iz firebase authentification u slučaju greške.
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


//LOGOUT
const logout = async () => {
  try {
    await signOut(auth)
    router.replace('/logout') 
  } catch (err) {
    console.error('Greška pri odjavi:', err)
  }
}



const stilInputa=ref('border-blue-600 border-2 rounded-lg bg-blue-200 mb-3 p-1 flex flex-col items-center');
const stilForme=ref('inline-block border-blue-600 bg-white border-4 rounded-lg mt-2 p-2');
</script>

<template>
  <!-- REGISTRACIJA -->
    <form :class="[stilForme]"  @submit.prevent="register">
     <strong>Registracija</strong><br>
     <hr></hr>
      <Label>Email:</Label><input :class="[stilInputa]" v-model="email" type="email" placeholder="naziv@gmail.com">
      <Label>Lozinka: </Label><input :class="[stilInputa]" v-model="password" type="password" placeholder="Upisite lozinku">
      <button class="border-orange-400 border-3 rounded-lg bg-orange-200 mb-3 p-2 flex flex-col items-center" type="submit">Registriraj se</button>
      <span :class="response.error ? 'text-rose-600' : 'text-emerald-600'">{{
        response.message }}</span>
    </form>

    <!--  PRIJAVA -->
 <form :class="[stilForme]" @submit.prevent="login" class="m-6">
 <strong>Prijava</strong><br>
 <hr></hr>
 <Label>Email:</Label><input :class="[stilInputa]" v-model="emailPrijava" type="email" placeholder="naziv@gmail.com">
 <Label>Lozinka:</Label><input :class="[stilInputa]" v-model="passwordPrijava" type="password" placeholder="Upisite lozinku">
 <button class="border-orange-400 border-3 rounded-lg bg-orange-200 mb-3 p-2 flex flex-col items-center" type="submit">Prijavi se</button>
 <span :class="response.error ? 'text-rose-600' : 'text-emerald-600'">{{
response.message }}</span>
 </form>

 <!-- GOOGLE PRIJAVA -->
 <button @click="loginWithGoogle()"class="border-orange-400 border-3 rounded-lg bg-orange-200 mb-3 p-2">Prijavi se s google racunom</button>
 <button @click.prevent="logout" class="border-red-600 border-3 rounded-lg bg-red-400 mb-3 p-2"><gumb>Odjava</gumb></button>
 <h1 class="text-red-600 text-xl"><strong>!</strong> Mogu se prijaviti samo postojeći korisnici, ukoliko nemate prijavljen račun, nastavite do gumba "Registracija" ili se prijavite google računom<strong>!</strong></h1>

<RouterLink to="/admin" class="hover:text-red-600 bg-amber-600">ADMIN login</RouterLink>

</template>

<style scoped>
</style>
