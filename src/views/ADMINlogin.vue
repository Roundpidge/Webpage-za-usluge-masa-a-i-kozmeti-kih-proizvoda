<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth} from '@/firebase.js'
import { useRouter} from "vue-router";
import { useUserStore } from '@/stores/projektStore.js';

const email=ref('');
const password=ref('');
const router=useRouter();
const user = useUserStore();

// ADMIN LOGIN
const response = ref({ error: false, message: '' })
const ADMINlogin = async () => {

 try {
    await signInWithEmailAndPassword(auth, email.value, password.value);

 const uloga = await user.nadiUlogu();
    if(uloga!="admin"){
    response.value={error: true, message:"Niste admin, prijava neuspjesna! " }
    await signOut(auth)
    return
}
response.value={error: false, message:"Dobrodosli! Prijava je uspjesna! " }
await router.replace({ name: 'adminPage', params: { email: email.value } })
return

 } catch (error) {
    response.value={error: true, message:"Greska pri prijavi! "}
 }
};

const stilInputa=ref('border-blue-600 border-2 rounded-lg bg-blue-200 mb-3 p-1 flex flex-col items-center');
const stilForme=ref('inline-block border-blue-600 bg-white border-4 rounded-lg mt-2 p-2');
</script>
<template>

     <!--ADMIN PRIJAVA-->
 <form :class="[stilForme]" @submit.prevent="ADMINlogin" >
  <h1><strong>Admin prijava</strong></h1>
 <hr></hr>
 <Label>Email:</Label><input :class="[stilInputa]" v-model="email" type="email" placeholder="naziv@gmail.com">
 <Label>Lozinka:</Label><input :class="[stilInputa]" v-model="password" type="password" placeholder="Upisite lozinku">

 <button class="border-orange-400 border-3 rounded-lg bg-orange-200 mb-3 p-2 flex flex-col items-center" type="submit">Prijavi se</button>
 <span :class="response.error ? 'text-rose-600' : 'text-emerald-600'">{{
response.message }}</span>
 </form>
 
</template>

<style scoped>
</style>
