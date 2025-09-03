<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { sendEmailVerification, updatePassword, deleteUser, signOut} from 'firebase/auth';
import { useProductsStore, useKosaricaStore, useUserStore } from "@/stores/projektStore.js"
import { auth } from '@/firebase.js'
import Swal from 'sweetalert2'

const stilInputa=ref('border-blue-600 border-2 rounded-lg bg-blue-200 mb-3 p-1 flex flex-col items-center');
const stilForme=ref('inline-block border-blue-600 bg-white border-4 rounded-lg mt-2 p-2');
const route = useRoute();
const router=useRouter();
const novaLozinka = ref('');
const open=ref(false);


const store=useProductsStore(); 
const cart=useKosaricaStore();
const userStore=useUserStore();

const promijeniLozinku = async () => {
 await updatePassword(auth.currentUser, novaLozinka.value);
 open.value=false
};

const sendVerification = async () => {
 await sendEmailVerification(auth.currentUser);
};

function otvoriObrazacZaPromjenu(){
return open.value=true;
}

const logout = () => {
 signOut(auth);
};

const obrisiKorisnika = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const result = await Swal.fire({
    title: "Jesi li sigurna?",
    text: "Ova radnja je nepovratna!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Da, obriši račun!",
    cancelButtonText: "Odustani"
  });

  if (!result.isConfirmed) return; 

  try {
    await storeUser.obrisiKorisnikaIzBaze();
    await deleteUser(user); 
    cart.isprazniKosaricu?.();
    storeUser.reset?.();
    await Swal.fire({
      title: "Obrisano!",
      text: "Tvoj račun i podaci su uspješno obrisani.",
      icon: "success"
    });
    router.replace('/');
  } catch (e) {
    if (e?.code === 'auth/requires-recent-login') {
      await Swal.fire({
        title: "Ponovna prijava potrebna",
        text: "Zbog sigurnosti se moraš ponovno prijaviti prije brisanja računa.",
        icon: "info"
      });
      router.push({ name: 'login', query: { redirect: 'delete-account' } });
      return;
    }
    console.error(e);
    await Swal.fire({
      title: "Greška",
      text: "Nešto je pošlo krivo pri brisanju računa. Pokušaj ponovno kasnije.",
      icon: "error"
    });
  }
};
</script>

<template>
    
    <h1>Korisnik: {{ route.params.email }}</h1>
    <img src="@/assets/placeholder.jpeg"></img>
    <hr></hr>
    <ol class="border-4">Košarica:<li v-for=" kosara in cart.kosarica">{{ kosara.naziv }} | {{ kosara.kolicina }} | {{ kosara.ukupnaCijena }} €</li></ol> 
    <button @click="cart.isprazniKosaricu()"class="bg-red-600">Isprazni košaricu</button>
 <button @click.prevent="sendVerification" class="bg-orange-600">Pošalji email potvrdu</button>

 <button @click="otvoriObrazacZaPromjenu">Promjena lozinke</button>
    <div v-if="open">
 <form @submit.prevent="promijeniLozinku">
 Nova lozinka:<input v-model="novaLozinka" type="password" placeholder="Nova lozinka">
 <button type="submit">Promijeni lozinku</button>
 </form>
    </div>
    <button @click.prevent="logout">Odjavi se</button>
    <button @click.prevent="obrisiKorisnika">Obriši korisnički račun</button>
</template>

<style scoped>
</style>
