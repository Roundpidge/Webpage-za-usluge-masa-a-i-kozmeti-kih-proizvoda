import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/firebase.js"
import { auth } from "@/firebase.js"

//PROIZVODI
const bazaProizvodi=[
        { id: 1, naziv: 'hidratantna krema za lice 250 g', kolicina: 10, cijena: 5.50 },
        { id: 2, naziv: 'pjena za lice 150 ml', kolicina: 5, cijena: 7.00 },
        { id: 3, naziv: 'pasta za njegu stopala 100 g', kolicina: 14, cijena: 8.50 },
        { id: 4, naziv: 'Aloe body lotion 236 ml', kolicina: 10, cijena: 5.50 },
        { id: 5, naziv: 'Aloe-bio celulozna maska 25 g', kolicina: 8, cijena: 2.30 },
        { id: 6, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 8, cijena: 2.30 },
        { id: 7, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 8, cijena: 2.30 },
        { id: 8, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 8, cijena: 2.30 },
        { id: 9, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 8, cijena: 2.30 },
        { id: 10, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 7, cijena: 2.30 },
    ]


export const useProductsStore = defineStore('proizvodi', () => {
const proizvodi = ref(bazaProizvodi)

proizvodi.value = proizvodi.value.map(p => ({
  ...p,
  id: Number(p.id),
  kolicina: Number(p.kolicina),
  cijena: Number(p.cijena),
})); //ZAŠTITA OD STRING UNOSA IZ INPUTA I V-MODELA ZA ID, KOLICINU I CIJENU

  const zadnjiId = computed(() =>proizvodi.value.length? Math.max(...proizvodi.value.map(p => Number(p.id) || 0)): 0)

  const sljedeciId = computed(() => zadnjiId.value + 1)

  function getById(id) {
    return proizvodi.value.find(p => Number(p.id) === Number(id))
  }

  function dodajNoviProizvod(n, k, c) {
    const id = Number(sljedeciId.value)
    proizvodi.value.push({
      id,
      naziv: String(n).trim(),
      kolicina: Number(k),
      cijena: Number(c),
    })
    return id
  }

    function IzmjeniPodatkeProizvoda(id, p) {
    const i=proizvodi.value.find(f => Number(f.id) === Number(id))
    if(!i)return false
    
      if(i.naziv!== undefined)i.naziv=p.naziv 
      if (i.kolicina !== undefined)i.kolicina=Number(p.kolicina)
      if(i.cijena !== undefined)i.cijena= Number(p.cijena)
    }

  const izbrisiProizvod = (id) => {
    const targetId = Number(id)
    proizvodi.value = proizvodi.value.filter(p => Number(p.id) !== targetId)
  }

  return { proizvodi, zadnjiId, sljedeciId, getById, dodajNoviProizvod, IzmjeniPodatkeProizvoda, izbrisiProizvod }
}, { persist: true })

const bazaTretmani=[
        { id: 1, naziv: 'Klasična masaža cijelog tijela', trajanje_min: 60 , cijena: 40.00 },
        { id: 2, naziv: 'Aromaterapijska masaža', trajanje_min: 45, cijena: 35.00 },
        { id: 3, naziv: 'Refleksologija stopala', trajanje_min: 30 , cijena: 25.00 },
        { id: 4, naziv: 'Masaža vrućim kamenjem', trajanje_min: 75 , cijena: 55.00 },
        { id: 5, naziv: 'Piling tijela + masaža', trajanje_min: 50 , cijena: 38.00 },
        { id: 6, naziv: 'Antistres masaža glave i vrata', trajanje_min: 20 , cijena: 18.00 },
        { id: 7, naziv: 'Sportska masaža', trajanje_min: 60, cijena: 45.00 },
        { id: 8, naziv: 'Masaža za trudnice', trajanje_min: 40 , cijena: 30.00 },
        { id: 9, naziv: 'Luksuzni tretman lica', trajanje_min: 55, cijena: 42.00 },
        { id: 10, naziv: 'Detox tretman tijela', trajanje_min: 70 , cijena: 50.00 },
    ];
//TRETMANI
export const useTretmaniStore = defineStore('treatmani', () => {
 
  const tretmani = ref(bazaTretmani);
    
  tretmani.value = tretmani.value.map(t => ({
  ...t,
  id: Number(t.id),
  trajanje: Number(t.trajanje),
  cijena: Number(t.cijena),
})); //ZAŠTITA OD STRING UNOSA IZ INPUTA I V-MODELA ZA ID, KOLICINU I CIJENU

  const zadnjiId2 = computed(() =>tretmani.value.length? Math.max(...tretmani.value.map(t => Number(t.id) || 0)): 0)

  const sljedeciId2 = computed(() => zadnjiId.value + 1)


  function getById2(id) {
    return tretmani.value.find(t => Number(t.id) === Number(id))
  }

    function dodajNoviTretman(n, t, c) {
    const id = Number(sljedeciId2.value)
    proizvodi.value.push({
      id,
      naziv: String(n).trim(),
      trajanje: Number(t),
      cijena: Number(c),
    })
    return id
  }
    function IzmjeniPodatkeTretmana(id, p) {
    const i=tretmani.value.find(f => Number(f.id) === Number(id))
    if(!i)return false
    
      if(i.naziv!== undefined)i.naziv=p.naziv 
      if (i.trajanje !== undefined)i.trajanje=Number(p.trajanje)
      if(i.cijena !== undefined)i.cijena= Number(p.cijena)
    }

  const izbrisiTretman = (id) => {
    const targetId = Number(id)
    tretmani.value = tretmani.value.filter(t => Number(t.id) !== targetId)
  }

    return { tretmani, zadnjiId2, sljedeciId2, getById2, dodajNoviTretman, IzmjeniPodatkeTretmana, izbrisiTretman }
}, { persist: true })


//KOŠARICA

const BazaKosarica=[]

export const useKosaricaStore = defineStore('kosarica', () => {
  const kosarica=ref(BazaKosarica)

 const proizvodStore=useProductsStore()

const kosaricaObavijestState=ref(false)

function izracunCijene(proizvodId, kol=1){
  const proizvod=proizvodStore.getById(Number(proizvodId));
  const cijenaIspravno=Number(proizvod?.cijena ?? 0)
  const kom = Number(kol)
  return cijenaIspravno*kom
}

 function dodajUKosaricu(proizvodId, kol=1){
  const proizvod=proizvodStore.getById(proizvodId);
  if(!proizvod) return

  const k= Math.max(1, Number(kol))

  kosarica.value.push({
    proizvodId: Number(proizvodId), 
    naziv: proizvod.naziv,
    kolicina: k, 
    ukupnaCijena: Number(proizvod.cijena)*kol
  })
  kosaricaObavijestState.value=true
 }

  function isprazniKosaricu (){
   kosarica.value=[]
  }
 return{kosarica,proizvodStore, kosaricaObavijestState, izracunCijene, dodajUKosaricu, isprazniKosaricu }
}, { persist: true })


//KORISNICI
export const useUserStore = defineStore('auth', () => {
    const uid = ref(null);
    const uloga = ref(null);

    const nadiUlogu = async () => {
        const id = auth.currentUser?.uid
        if (!id) { 
          uid.value = null; 
          uloga.value = null; 
          return null }
          uid.value = id
        const snap = await getDoc(doc(db, "users", id))
        const role=snap.exists() ? snap.data().uloga ?? null :null
        uloga.value=role
        return role
    }

     const obrisiKorisnikaIzBaze = async (idOverride) => {
    const userId = idOverride ?? auth.currentUser?.uid
    if (!userId) throw new Error('Nema prijavljenog korisnika.')

    const refUser = doc(db, 'users', userId)
    const snap = await getDoc(refUser)
    if (!snap.exists()) return 

    await deleteDoc(refUser)
  }

  const reset = () => { uid.value = null; uloga.value = null }

  return { uid, uloga, nadiUlogu, obrisiKorisnikaIzBaze, reset }
})
