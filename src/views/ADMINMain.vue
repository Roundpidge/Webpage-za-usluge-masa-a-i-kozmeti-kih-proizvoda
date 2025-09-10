

<script setup>
import {ref, computed} from 'vue'
import { useRouter, useRoute } from "vue-router";
import { useProductsStore, useKosaricaStore, useTretmaniStore, useUserStore  } from "@/stores/projektStore.js"
import {signOut,  updatePassword, deleteUser, onAuthStateChanged} from 'firebase/auth'
import { auth } from '@/firebase.js'
import Swal from 'sweetalert2';
import placeholder from '@/assets/placeholder.jpeg' 
import naslov from '@/components/naslov.vue'
import tekst from '@/components/tekst.vue'
import gumb2 from '@/components/gumbVanNavbar.vue'

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
const novi_photoDataUrl=ref(null);

//VARIJABLE ZA IZMJENU PODATAKA O PROIZVODU
const izmjenaNaziv=ref('');
const izmjenaKolicina=ref(0);
const izmjenaCijena=ref(0);
const izmjenaId=ref(null);
const izmjena_photoDataUrl=ref(null);

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
izmjena_photoDataUrl.value=proizvod.slika
return edit.value=true;
}

//IZMJENA-PROIZVODI
function saveEditing(){
  if(izmjenaId.value===(null))return

const trenutni = store.getById(izmjenaId.value)?.slika ?? placeholder

  const noviProizvod = {
    id: Number(izmjenaId.value),
    naziv: izmjenaNaziv.value, 
    kolicina: Number(izmjenaKolicina.value), 
    cijena: Number(izmjenaCijena.value),
    slika: izmjena_photoDataUrl.value ?? trenutni
  }

  store.IzmjeniPodatkeProizvoda(izmjenaId.value, noviProizvod)
  izmjenaId.value=null
  izmjena_photoDataUrl.value=null
  edit.value=false
  Swal.fire(`Promjene su spremljene za ${izmjenaNaziv.value}!`);
}

//TOKOM IZMJENE SLIKA
function onEditFile(e) {
  const file = e.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const fr = new FileReader()
  fr.onload = () => { izmjena_photoDataUrl.value = String(fr.result) }
  fr.readAsDataURL(file)
}

//DODAVANJE SLIKE
function onNewFile(e) {
  const file = e.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const fr = new FileReader()
  fr.onload = () => { novi_photoDataUrl.value = String(fr.result) }
  fr.readAsDataURL(file)
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
  await store.dodajNoviProizvod(novoNaziv.value, novoKolicina.value, novoCijena.value,  novi_photoDataUrl.value)
    await Swal.fire("Saved!", "", "success");
      novoNaziv.value = ''
      novoKolicina.value = 0
      novoCijena.value = 0
      novi_photoDataUrl.value = null
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
const novi_photoDataUrl_T=ref(null);

//VARIJABLE ZA IZMJENU PODATAKA O TRETMANU
const izmjenaNazivT=ref('');
const izmjenaTrajanjeT=ref(0);
const izmjenaCijenaT=ref(0);
const izmjenaIdT=ref(null);
const izmjena_photoDataUrl_T=ref(null);

//POSTAVLJANJE ZA IZMJENU-TRETMANI
function postaviNaEditingT(tretman){
  izmjenaIdT.value=tretman.id
  izmjenaNazivT.value=tretman.naziv
  izmjenaTrajanjeT.value=tretman.trajanje_min  
  izmjenaCijenaT.value=tretman.cijena
  izmjena_photoDataUrl_T.value=tretman.slika ?? null
  return edit.value = true
}

//IZMJENA-TRETMAN
function saveEditingT(){
  if(izmjenaIdT.value===(null))return

  const noviTretman = {
    id: Number(izmjenaIdT.value),
    naziv: izmjenaNazivT.value, 
    trajanje: Number(izmjenaTrajanjeT.value), 
    cijena: Number(izmjenaCijenaT.value),
    slika: izmjena_photoDataUrl_T.value ?? placeholder
  }

  storeT.IzmjeniPodatkeTretmana(izmjenaIdT.value, noviTretman)
  izmjenaIdT.value=null
  izmjena_photoDataUrl_T.value=null
  edit.value=false
  Swal.fire(`Promjene su spremljene za ${izmjenaNazivT.value}!`);
}

//TOKOM IZMJENE SLIKA
function onEditFile_T(e) {
  const file = e.target.files?.[0]
  if (!file || !file.type.startsWith('image/') ) return
  const fr = new FileReader()
  fr.onload = () => { izmjena_photoDataUrl_T.value = String(fr.result) }
  fr.readAsDataURL(file)
}

//DODAVANJE SLIKE
function onNewFile_T(e) {
  const file = e.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const fr = new FileReader()
  fr.onload = () => { novi_photoDataUrl_T.value = String(fr.result) }
  fr.readAsDataURL(file)
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
  await storeT.dodajNoviTretman(novoNazivT.value, novoTrajanjeT.value, novoCijenaT.value, novi_photoDataUrl_T.value)
    await Swal.fire("Saved!", "", "success");
      novoNazivT.value = ''
      novoTrajanjeT.value = 0
      novoCijenaT.value = 0
      novi_photoDataUrl_T.value = null
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

const stilInputa = ref('bg-[#affa94] text-[#1b7511] rounded-sm mb-3 p-2 max-w-md');
const stilForme  = ref('flex flex-col items-start text-[#1b7511] mt-2 p-2');
</script>
<template>
   <naslov>Dobrodosli admin! </naslov> 
   <tekst>
   <label>Što želite dalje? </label>
   <select name="odabiri" v-model="odabir">
    <option value="proizvod">Pregled proizvoda</option>
    <option value="tretman">Pregled tretmana</option>
    <option value="">Osnovne informacije</option>
   </select>
   </tekst> 

   <!--KORISNIK INFO-->
<div v-if="!isProizvod && !isTretman"> 
  <tekst>
    Email: {{ route.params.email }}

    <!-- CENTRIRANA KOŠARICA -->
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
      <gumb2 @click.prevent="logout">Odjavi se od računa</gumb2>
      <gumb2 @click.prevent="obrisiKorisnika">Obriši admin račun</gumb2>
    </div>

    <!-- PROMJENA LOZINKE -->
    <div v-if="open" class="flex justify-center mt-4">
      <form :class="stilForme" @submit.prevent="promijeniLozinku">
        Nova lozinka:
        <input :class="stilInputa" v-model="novaLozinka" type="password" placeholder="Nova lozinka">
        <div class="flex gap-4 mt-2"> <gumb2 type="submit">Promijeni lozinku</gumb2> <gumb2 @click="open=false">Odustani</gumb2></div>
      </form>
    </div>
  </tekst>
</div>

    

   <!--PROIZVODI-->
 <div  v-if="isProizvod && !isTretman">
  <tekst>
    <ol class=" w-fit flex justify-center m-2 rounded ">
      <li v-for="proizvod in store.proizvodi" :key="proizvod?.id">
         <img :src="proizvod.slika || placeholder" alt="slika" class="max-h-20 inline-block ml-2" />
      <li class="m-3">{{ proizvod.naziv }}</li><br></br>
      <li class="text-gray-700">{{ proizvod.cijena }} €</li>
      <br></br>
      <button @click="postaviNaEditing(proizvod)"class="bg-[#81E15E] hover:text-[#24b550] w-20 h-10 text-sm text-[#1b7511] rounded-3xl">Izmjeni podatke </button>
      <button @click="obrisiProizvod(proizvod.id, proizvod.naziv)"class="bg-[#81E15E] hover:text-[#b52424] w-15 h-10 text-sm text-[#1b7511] rounded-3xl">Izbriši proizvod</button>
      <br>
    </li>
    </ol>
    </tekst>

    <div v-if="edit">
      <!--IZMJENA-->
    <form @submit.prevent="saveEditing()"class="p-2">
      <label>Naziv:</label><label class="ml-40"> Količina:</label><label class="ml-39">Cijena u eurima: </label><br></br> 
        <input :class="stilInputa" class="mr-3" type="text" placeholder="naziv proizvoda..."v-model="izmjenaNaziv"></input>
        <input :class="stilInputa" class="mr-3" type="number" placeholder="Kolicina..."v-model.number="izmjenaKolicina"></input>
        <input :class="stilInputa" type="number" placeholder="Cijena..." v-model.number="izmjenaCijena"></input>
        <input id="editProdFile" class="hidden" type="file" accept="image/*" @change="onEditFile" />
<label for="editProdFile" class="inline-block">
  <gumb2 class="mb-2">Promijeni sliku</gumb2>
</label>
<img v-if="izmjena_photoDataUrl" :src="izmjena_photoDataUrl" class="h-16 rounded inline-block ml-2" alt="pregled nove slike proizvoda" />
        <gumb2 type="submit">Spremi</gumb2>  <gumb2 @click="edit=false">Odustani</gumb2>
    </form>
    </div>
       <!-- DODAVANJE PROIZVODA -->
<form @submit.prevent="dodajProizvod" class="mt-10">
  <div class="flex flex-wrap items-end gap-3">
    <div class="flex flex-col">
      <label class="mb-1">Naziv</label>
      <input :class="stilInputa" type="text" v-model="novoNaziv" />
    </div>
    <div class="flex flex-col">
      <label class="mb-1">Količina</label>
      <input :class="stilInputa" type="number" v-model.number="novoKolicina" />
    </div>
    <div class="flex flex-col">
      <label class="mb-1">Cijena (EUR)</label>
      <input :class="stilInputa" type="number" step="0.01" min="0" v-model.number="novoCijena" />
    </div>
    <div class="flex flex-col">
      <label class="mb-1">Slika</label>
      <input :class="stilInputa" type="file" accept="image/*" @change="onNewFile" />
    </div>
    <gumb2 type="submit" class="mb-1">Dodaj proizvod</gumb2>
    <img v-if="novi_photoDataUrl" :src="novi_photoDataUrl" class="h-16 rounded inline-block"  alt="preview proizvoda"/>
  </div>
</form>
</div>

<!-- TRETMANI -->
<div v-if="!isProizvod && isTretman">
  <tekst>
    <ol class="w-fit flex justify-center m-2 rounded">
      <li v-for="tretman in storeT.tretmani" :key="tretman?.id" class="text-center mx-6">
        <img :src="tretman.slika || placeholder" alt="slika tretmana" class="max-h-20 inline-block ml-2"/>

        <li class="m-3">{{ tretman.naziv }}</li>
        <li class="text-gray-700">{{ tretman.cijena }} €</li>
        <br/>

        <button @click="postaviNaEditingT(tretman)" class="bg-[#81E15E] hover:text-[#24b550] w-20 h-10 text-sm text-[#1b7511] rounded-3xl">
        Izmjeni podatke
        </button>

        <button @click="obrisiTretman(tretman.id, tretman.naziv)"class="bg-[#81E15E] hover:text-[#b52424] w-15 h-10 text-sm text-[#1b7511] rounded-3xl">
          Izbriši tretman
        </button>
        <br/>
      </li>
    </ol>
  </tekst>

  <!-- IZMJENA TRETMANA -->
  <div v-if="edit">
    <form @submit.prevent="saveEditingT()" class="p-2">
      <label>Naziv:</label>
      <label class="ml-40">Trajanje (min):</label>
      <label class="ml-36">Cijena u eurima:</label>
      <br />
      <input :class="stilInputa" class="mr-3" type="text" placeholder="naziv tretmana..." v-model="izmjenaNazivT"/>
      <input :class="stilInputa"  class="mr-3" type="number" placeholder="Trajanje u minutama..." v-model.number="izmjenaTrajanjeT" />
      <input :class="stilInputa" type="number" placeholder="Cijena..." v-model.number="izmjenaCijenaT"/>
      <input :class="stilInputa" type="file" accept="image/*" @change="onEditFile_T" />
      <img v-if="izmjena_photoDataUrl_T" :src="izmjena_photoDataUrl_T" class="h-16 inline-block ml-2"/>
      <gumb2 type="submit">Spremi</gumb2>
      <gumb2 @click="edit=false">Odustani</gumb2>
    </form>
  </div>


 <!-- DODAVANJE TRETMANA -->
<form @submit.prevent="dodajTretman" class="mt-10">
  <div class="flex flex-wrap items-end gap-3">
    <div class="flex flex-col">
      <label class="mb-1">Naziv</label>
      <input :class="stilInputa" type="text" v-model="novoNazivT" />
    </div>
    <div class="flex flex-col">
      <label class="mb-1">Trajanje (min)</label>
      <input :class="stilInputa" type="number" min="1" v-model.number="novoTrajanjeT" />
    </div>
    <div class="flex flex-col">
      <label class="mb-1">Cijena (EUR)</label>
      <input :class="stilInputa" type="number" step="0.01" min="0" v-model.number="novoCijenaT" />
    </div>
    <div class="flex flex-col">
      <label class="mb-1">Slika</label>
      <input :class="stilInputa" type="file" accept="image/*" @change="onNewFile_T" />
    </div>
    <gumb2 type="submit" class="mb-1">Dodaj tretman</gumb2>
    <img v-if="novi_photoDataUrl_T" :src="novi_photoDataUrl_T" class="h-16 rounded inline-block"alt="preview tretmana"/>
  </div>
</form>
</div>
</template>
