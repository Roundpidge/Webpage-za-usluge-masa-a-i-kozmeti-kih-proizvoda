<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth} from '@/firebase.js'
import { useRouter} from "vue-router";
import { useUserStore } from '@/stores/projektStore.js';
import naslov from '@/components/naslov.vue'
import gumb2 from '@/components/gumbVanNavbar.vue'

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

const stilInputa = ref('bg-[#affa94] rounded-sm mb-3 p-2 w-full max-w-md text-center');
const stilForme  = ref('flex flex-col items-center text-[#1b7511] mt-2 p-2');
</script>
<template>
  <!--ADMIN PRIJAVA-->
  <form :class="[stilForme]" @submit.prevent="ADMINlogin">
    <naslov>Admin prijava</naslov>

    <label class="self-center mt-2">Email:</label>
    <input :class="[stilInputa]" v-model="email" type="email" placeholder="naziv@gmail.com" />

    <label class="self-center">Lozinka:</label>
    <input :class="[stilInputa]" v-model="password" type="password" placeholder="Upisite lozinku" />

    <gumb2 class="mb-3 p-2" type="submit">Prijavi se</gumb2>

    <span :class="response.error ? 'text-rose-600' : 'text-emerald-600'">
      {{ response.message }}
    </span>
  </form>
</template>

<style scoped>
</style>
