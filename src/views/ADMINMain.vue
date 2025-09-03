

<script setup>
  
import {ref, computed} from 'vue'
import { useRouter, useRoute } from "vue-router";
import { useProductsStore, useKosaricaStore, useTretmaniStore, useUserStore  } from "@/stores/projektStore.js"
import {signOut,  updatePassword, deleteUser, onAuthStateChanged} from 'firebase/auth'
import { auth } from '@/firebase.js'


import Swal from 'sweetalert2';

const router=useRouter();
const route=useRoute();
const store=useProductsStore(); 
const storeT=useTretmaniStore();
const odabir=ref('')
const isProizvod = computed(() => odabir.value === 'proizvod')
const isTretman  = computed(() => odabir.value === 'tretman')
const userStore=useUserStore();
const cart=useKosaricaStore();

//VARIJABLE ZA DODAVANJE NOVOG PROIZVODA
const novoNaziv=ref('');
const novoKolicina=ref(0);
const novoCijena=ref(0);
const novoId=ref(1);

//VARIJABLE ZA IZMJENU PODATAKA O PROIZVODU
const izmjenaNaziv=ref('');
const izmjenaKolicina=ref(0);
const izmjenaCijena=ref(0);
const izmjenaId=ref(null);

const edit=ref(false);

// VARIJABLE VEZANE ZA KORISNIKE
const novaLozinka = ref('');
const open=ref(false);

//POSTAVLJANJE ZA IZMJENU-PROIZVODI
function postaviNaEditing(proizvod){
izmjenaId.value=proizvod.id
izmjenaNaziv.value=proizvod.naziv
izmjenaKolicina.value=proizvod.kolicina
izmjenaCijena.value=proizvod.cijena
return edit.value=true;
}

//IZMJENA-PROIZVODI
function saveEditing(){
  if(izmjenaId.value===(null))return

  const noviProizvod = {
    id: Number(izmjenaId.value),
    naziv: izmjenaNaziv.value, 
    kolicina: Number(izmjenaKolicina.value), 
    cijena: Number(izmjenaCijena.value)
  }

  store.IzmjeniPodatkeProizvoda(izmjenaId.value, noviProizvod)
  izmjenaId.value=null
  edit.value=false
  Swal.fire(`Promjene su spremljene za ${izmjenaNaziv.value}!`);
}

//BRISANJE-PROIZVODI
const obrisiProizvod = async(id, naziv)=> 

{ const {isConfirmed} = 
await Swal.fire({ 
  title: `Jeste li sigurni da zelite obrisati proizvod ${naziv}?`, 
  text: "Nece biti moguce ponistiti ovu radnju!", 
  icon: "warning", 
  showCancelButton: true, 
  confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Obrisi" }) 
  if (isConfirmed) { 
  try{ 
  await store.izbrisiProizvod(id) 
  Swal.fire({ 
    title: "Obrisano!", 
    text: "Proizvod je uspjesno izbrisan", 
    icon: "success" }) 
    window.location.reload() 
    }catch(error){ 
    await Swal.fire('Greška', 'Brisanje nije uspjelo.', 'error') 
  } 
} 
}

 function miniValidacija(){
  const errors=[]
    if(!novoNaziv.value.trim())errors.push('Obavezan upis naziva proizvoda! ')
    if(novoKolicina.value<=0)errors.push('Kolicina mora biti iznad 0! ')
    if(novoCijena.value<=0)errors.push('Cijena mora biti veća od 0')

    return errors;
 }

//DODAVANJE-PROIZVODI
const dodajProizvod= async()=>{
  const errors=miniValidacija()
  if(errors.length){
    await Swal.fire('Provjera podataka', errors.join('\n'), 'info')
    return
  }
  const {isConfirmed, isDenied} = await Swal.fire({
  title: "Do you want to save the changes?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "Save",
  denyButtonText: `Don't save`
})
  if (isConfirmed) {
    try{
  await store.dodajNoviProizvod(novoNaziv.value, novoKolicina.value, novoCijena.value)
    await Swal.fire("Saved!", "", "success");
      novoNaziv.value = ''
      novoKolicina.value = 0
      novoCijena.value = 0
       } catch (e) {
      await Swal.fire('Greška', 'Spremanje nije uspjelo.', 'error')
    }
   
  } else if (isDenied) {
    Swal.fire("Changes are not saved", "", "info");
  }
}

//TRETMANI RADNJE:
//VARIJABLE ZA DODAVANJE NOVOG TRETMANA
const novoNazivT=ref('');
const novoTrajanjeT=ref(0);
const novoCijenaT=ref(0);
const novoIdT=ref(1);

//VARIJABLE ZA IZMJENU PODATAKA O TRETMANU
const izmjenaNazivT=ref('');
const izmjenaTrajanjeT=ref(0);
const izmjenaCijenaT=ref(0);
const izmjenaIdT=ref(null);

//POSTAVLJANJE ZA IZMJENU-TRETMANI
function postaviNaEditingT(tretman){
izmjenaIdT.value=tretman.id
izmjenaNazivT.value=tretman.naziv
izmjenaTrajanjeT.value=tretman.trajanje
izmjenaCijenaT.value=tretman.cijena
return edit.value=true;
}

//IZMJENA-TRETMAN
function saveEditingT(){
  if(izmjenaIdT.value===(null))return

  const noviTretman = {
    id: Number(izmjenaIdT.value),
    naziv: izmjenaNazivT.value, 
    trajanje: Number(izmjenaTrajanjeT.value), 
    cijena: Number(izmjenaCijenaT.value)
  }

  storeT.IzmjeniPodatkeTretmana(izmjenaIdT.value, noviTretman)
  izmjenaIdT.value=null
  edit.value=false
  Swal.fire(`Promjene su spremljene za ${izmjenaNazivT.value}!`);
}

//BRISANJE-TRETMANI
const obrisiTretman = async(id, naziv)=> 
{ const {isConfirmed} = 
await Swal.fire({ 
  title: `Jeste li sigurni da zelite obrisati tretman ${naziv}?`, 
  text: "Nece biti moguce ponistiti ovu radnju!", 
  icon: "warning", 
  showCancelButton: true, 
  confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Obrisi" }) 
  if (isConfirmed) { 
  try{ 
  await storeT.izbrisiTretman(id) 
  Swal.fire({ 
    title: "Obrisano!", 
    text: "Tretman je uspjesno izbrisan", 
    icon: "success" }) 
    }catch(error){ 
    await Swal.fire('Greška', 'Brisanje nije uspjelo.', 'error') 
  } 
} 
}

 function miniValidacijaT(){
  const errors=[]
    if(!novoNazivT.value.trim())errors.push('Obavezan upis naziv tretmana! ')
    if(novoTrajanjeT.value<=0)errors.push('Tretman mora trajati barem minutu ! ')
    if(novoCijenaT.value<=0)errors.push('Cijena mora biti veća od 0')

    return errors;
 }

//DODAVANJE-TRETMANI
const dodajTretman= async()=>{
  const errors=miniValidacijaT()
  if(errors.length){
    await Swal.fire('Provjera podataka', errors.join('\n'), 'info')
    return
  }
  const {isConfirmed, isDenied} = await Swal.fire({
  title: "Do you want to save the changes?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "Save",
  denyButtonText: `Don't save`
})
  if (isConfirmed) {
    try{
  await storeT.dodajNoviTretman(novoNazivT.value, novoTrajanjeT.value, novoCijenaT.value)
    await Swal.fire("Saved!", "", "success");
      novoNaziv.value = ''
      novoKolicina.value = 0
      novoCijena.value = 0
       } catch (e) {
      await Swal.fire('Greška', 'Spremanje nije uspjelo.', 'error')
    }
   
  } else if (isDenied) {
    Swal.fire("Changes are not saved", "", "info");
  }
}

// FUNKCIJE VEZANE ZA KORISNIKE

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

const waitUntilSignedOut = () =>
  new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { unsub(); resolve(); }
    });
  });

const obrisiKorisnika = async () => {
  const user = auth.currentUser
  if (!user) return

  const { isConfirmed } = await Swal.fire({
    title: "Jesi li sigurna?",
    text: "Ova radnja je nepovratna!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Da, obriši račun",
    cancelButtonText: "Odustani"
  })
  if (!isConfirmed) return

  try {
    
    await userStore.obrisiKorisnikaIzBaze()
    await deleteUser(user)
    await waitUntilSignedOut()

    cart.isprazniKosaricu?.()
    userStore.reset?.()

    await Swal.fire({
      title: "Obrisano!",
      text: "Tvoj račun je uspješno obrisan.",
      icon: "success"
    })
    router.replace('/')
  } catch (e) {
    console.error(e)

    if (e?.code === 'auth/requires-recent-login') {
      await Swal.fire({
        title: "Ponovna prijava potrebna",
        text: "Radi sigurnosti moraš se ponovno prijaviti prije brisanja računa.",
        icon: "info"
      })
      router.push({ name: 'login', query: { redirect: 'delete-account' } })
      return
    }

    await Swal.fire({
      title: "Greška",
      text: "Nešto je pošlo krivo pri brisanju računa.",
      icon: "error"
    })
  }
}

//LOGOUT
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
   <span>Dobrodosli admin! </span>  
   <label>Što želite dalje? </label>
   <select name="odabiri" v-model="odabir">
    <option value="proizvod">Pregled proizvoda</option>
    <option value="tretman">Pregled tretmana</option>
    <option value="">Osnovne informacije</option>
   </select>

   <!--KORISNIK INFO-->
   <div v-if="!isProizvod && !isTretman">
   <h1>Email: {{ route.params.email }}</h1>
   <ol class="border-4">Košarica:<li v-for=" kosara in cart.kosarica">{{ kosara.naziv }} | {{ kosara.kolicina }} | {{ kosara.ukupnaCijena }} €</li></ol> <button @click="cart.isprazniKosaricu()"class="bg-red-600">Isprazni košaricu</button>
    <button @click="otvoriObrazacZaPromjenu">Promjena lozinke</button>
    <div v-if="open">
 <form @submit.prevent="promijeniLozinku">
 Nova lozinka:<input v-model="novaLozinka" type="password" placeholder="Nova lozinka">
 <button type="submit">Promijeni lozinku</button>
 </form>
    </div>
    <button @click.prevent="logout">Odjavi se</button>
    <button @click.prevent="obrisiKorisnika">Obriši korisnički račun</button>
    </div>

   <!--PROIZVODI-->
 <div class="border-r border-blue-400" v-if="isProizvod && !isTretman">
    <ol class=" w-fit flex justify-center m-2 rounded ">
      <li v-for="proizvod in store.proizvodi" :key="proizvod?.id">
      <RouterLink :to="`/proizvodDetaljno/${proizvod.id}`"class="hover:text-orange-400">{{ proizvod.naziv }} | {{ proizvod.cijena }} €</RouterLink>
      <button @click="postaviNaEditing(proizvod)">Izmjeni podatke o proizvodu</button>
      <button @click="obrisiProizvod(proizvod.id, proizvod.naziv)"class="m-2">Izbriši proizvod</button>
      <br>
    </li>
    </ol>

    <div v-if="edit">
    <form @submit.prevent="saveEditing()"class="border-4 p-2">
        <input type="text" placeholder="naziv proizvoda..."v-model="izmjenaNaziv"></input>
        <input type="number" placeholder="Kolicina..."v-model.number="izmjenaKolicina"></input>
        <input type="number" placeholder="Cijena..." v-model.number="izmjenaCijena"></input>
        <button type="submit">Spremi</button>  <button @click="edit=false">Odustani</button>
    </form>
    </div>
       <form @submit.prevent="dodajProizvod">
        <Label>Naziv: Kolicina:  Cijena: </Label> 
        <input type="text" v-model="novoNaziv">
        <input type="number" v-model.number="novoKolicina"> 
        <input type="number" set="0.01" min="0" v-model.number="novoCijena">
        <button type="submit">Dodaj proizvod</button>
      </form>
</div>

<!--TRETMANI-->
  <div v-if="!isProizvod && isTretman">
    <ol class=" w-fit flex justify-center m-2 rounded">
      <li v-for="tretman in storeT.tretmani" :key="tretman?.id">
      <RouterLink :to="`/tretmanDetaljno/${tretman.id}`"class="hover:text-orange-400">{{ tretman.naziv }} | {{ tretman.cijena }} €</RouterLink>
      <button @click="postaviNaEditingT(tretman)">Izmjeni podatke o tretmanu</button>
      <button @click="obrisiTretman(tretman.id, tretman.naziv)"class="m-2">Izbriši tretman</button>
    </li>
    </ol>
     <div v-if="edit">
    <form @submit.prevent="saveEditingT()"class="border-4 p-2">
        <input type="text" placeholder="naziv tretmana..."v-model="izmjenaNazivT"></input>
        <input type="number" placeholder="Trajanje u minutama..."v-model.number="izmjenaTrajanjeT"></input>
        <input type="number" placeholder="Cijena..." v-model.number="izmjenaCijenaT"></input>
        <button type="submit">Spremi</button>  <button @click="edit=false">Odustani</button>
    </form>
    </div>
       <form @submit.prevent="dodajTretman">
        <Label>Naziv: Trajanje:  Cijena: </Label> 
        <input type="text" v-model="novoNazivT">
        <input type="number" v-model.number="novoTrajanjeT"> 
        <input type="number" set="0.01" min="0" v-model.number="novoCijenaT">
        <button type="submit">Dodaj proizvod</button>
      </form>
  </div>
</template>
