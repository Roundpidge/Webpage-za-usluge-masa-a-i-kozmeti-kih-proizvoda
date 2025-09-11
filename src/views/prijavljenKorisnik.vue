<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { updatePassword, deleteUser, signOut } from 'firebase/auth'
import { useProductsStore, useKosaricaStore, useUserStore } from '@/stores/projektStore.js'
import { auth } from '@/firebase.js'
import Swal from 'sweetalert2'
import naslov from '@/components/naslov.vue'
import tekst from '@/components/tekst.vue'
import gumb2 from '@/components/gumbVanNavbar.vue'
import placeholder from '@/assets/placeholder.jpeg'

const route = useRoute()
const router = useRouter()

const stilInputa = ref('bg-[#affa94] text-[#1b7511] rounded-sm mb-3 p-2 max-w-md')
const stilForme  = ref('flex flex-col items-start text-[#1b7511] mt-2 p-2')

const novaLozinka = ref('')
const open = ref(false)

const store = useProductsStore()
const cart = useKosaricaStore()
const userStore = useUserStore()

const promijeniLozinku = async () => {
  await updatePassword(auth.currentUser, novaLozinka.value)
  open.value = false
}

function otvoriObrazacZaPromjenu() {
  open.value = true
}

const logout = async () => {
  try {
    await signOut(auth)
    router.replace('/logout')  
  } catch (e) {
    console.error('Greška pri odjavi:', e)
  }
}

const obrisiKorisnika = async () => {
  const user = auth.currentUser
  if (!user) return

  const result = await Swal.fire({
    title: 'Jesi li sigurna?',
    text: 'Ova radnja je nepovratna!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Da, obriši račun!',
    cancelButtonText: 'Odustani'
  })
  if (!result.isConfirmed) return

try {
  await userStore.obrisiKorisnikaIzBaze?.()
  await deleteUser(user)

  cart.isprazniKosaricu?.()
  userStore.reset?.()

  await Swal.fire({
    title: 'Obrisano!',
    text: 'Tvoj račun i podaci su uspješno obrisani.',
    icon: 'success'
  })

  router.replace('/logout')  
} catch (e) {
  if (e?.code === 'auth/requires-recent-login') {
    await Swal.fire({
      title: 'Ponovna prijava potrebna',
      text: 'Zbog sigurnosti se moraš ponovno prijaviti prije brisanja računa.',
      icon: 'info'
    })
    router.push({ name: 'login', query: { redirect: 'delete-account' } })
    return
  }
  console.error(e)
  await Swal.fire({
    title: 'Greška',
    text: 'Nešto je pošlo krivo pri brisanju računa. Pokušaj ponovno kasnije.',
    icon: 'error'
  })
}

}
</script>

<template>
  <naslov>Korisnički račun</naslov>
  <tekst>
    <p>Email: {{ route.params.email }}</p>

<div class="flex flex-col items-center mt-4">
  <img :src="placeholder" alt="Profilna slika" class="h-28 w-28 rounded-full border-4 border-[#affa94] mb-3" />
</div>

    <!-- košarica -->
    <div class="flex justify-center mt-6">
      <ol class="border-4 border-[#affa94] rounded-xl p-4 text-center w-fit">
        <h2 class="text-xl font-semibold mb-2">Košarica:</h2>
        <li v-for="kosara in cart.kosarica" :key="kosara.naziv">
           {{ kosara.naziv }} <span class="ml-3"></span> x{{ kosara.kolicina }} <span class="ml-3"></span>  {{ kosara.ukupnaCijena }} €
        </li>
      </ol>
    </div>

    <div class="flex justify-center gap-4 mt-6">
      <gumb2 @click="cart.isprazniKosaricu()">Isprazni košaricu</gumb2>
      <gumb2 @click="otvoriObrazacZaPromjenu">Promjena lozinke</gumb2>
      <gumb2 @click.prevent="logout">Odjavi se</gumb2>
      <gumb2 @click.prevent="obrisiKorisnika">Obriši račun</gumb2>
    </div>

    <!-- promjena lozinke -->
<div v-if="open" class="flex justify-center mt-4">
  <form :class="stilForme" @submit.prevent="promijeniLozinku">
    <div v-if="providerId === 'password'">
      Trenutna lozinka:
      <input :class="stilInputa" v-model="trenutnaLozinka" type="password" placeholder="Trenutna lozinka" />
    </div>

    Nova lozinka:
    <input :class="stilInputa" v-model="novaLozinka" type="password" placeholder="Nova lozinka" />

    <div class="flex gap-4 mt-2"> <gumb2 type="submit">Promijeni lozinku</gumb2> <gumb2 @click="open=false">Odustani</gumb2>
    </div>
  </form>
</div>

  </tekst>
</template>

