<script setup>

import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase.js'
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref('')
const password = ref('')
const response = ref({ error: false, message: '' })

const register = async () => {
 try {
 const userCredential = await createUserWithEmailAndPassword(auth, email.value,
password.value);
 response.value.error = false;
 response.value.message = 'Korisnik registriran: ' +
JSON.stringify(userCredential.user);

await router.replace({ name: 'korisnik', params: {email: email.value} })
return

 } catch (error) {
 response.value.error = true;
 response.value.message = 'Greška pri registraciji: ' + error.message;
 }
};

const stilInputa=ref('border-blue-600 border-2 rounded-lg bg-blue-200 mb-3 p-1 flex flex-col items-center');
const stilForme=ref('inline-block border-blue-600 bg-white border-4 rounded-lg mt-2 p-2');
</script>

<template>
    <form :class="[stilForme]"  @submit.prevent="register">
     <strong>Registracija</strong><br>
     <hr></hr>
      <Label>Email:</Label><input :class="[stilInputa]" v-model="email" type="email" placeholder="naziv@gmail.com">
      <Label>Lozinka: </Label><input :class="[stilInputa]" v-model="password" type="password" placeholder="Upisite lozinku">
      <button class="border-orange-400 border-3 rounded-lg bg-orange-200 mb-3 p-2 flex flex-col items-center" type="submit">Registriraj se</button>
      <span :class="response.error ? 'text-rose-600' : 'text-emerald-600'">{{
        response.message }}</span>
    </form>
</template>

<style scoped>
</style>
