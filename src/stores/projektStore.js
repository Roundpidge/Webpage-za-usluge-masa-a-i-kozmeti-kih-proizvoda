import { defineStore } from "pinia"
import { ref } from "vue"
export const useproductsStore = defineStore('proizvodiStore', () => {

    const proizvodi = ref([
        { id: 1, naziv: 'hidratantna krema za lice 250 g', kolicina: 10, cijena: 5.50, },
        { id: 2, naziv: 'pjena za lice 150 ml', kolicina: 5, cijena: 7.00 },
        { id: 3, naziv: 'pasta za njegu stopala 100 g', kolicina: 14, cijena: 8.50 },
        { id: 4, naziv: 'Aloe body lotion 236 ml', kolicina: 10, cijena: 5.50 },
        { id: 5, naziv: 'Aloe-bio celulozna maska 25 g', kolicina: 8, cijena: 2.30 },
        { id: 6, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 8, cijena: 2.30 },
        { id: 7, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 8, cijena: 2.30 },
        { id: 8, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 8, cijena: 2.30 },
        { id: 9, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 8, cijena: 2.30 },
        { id: 10, naziv: 'Aloe-bio celulozna maska 12 g', kolicina: 7, cijena: 2.30 },
    ]);


    function getById(id) {
        return proizvodi.value.find(p => p.id === Number(id))
    }


    return { proizvodi, getById }
}, { persist: true })


export const usetretmaniStore = defineStore('tretmaniStore', () => {

    const tretmani = ref([
        { id: 1, naziv: 'Klasična masaža cijelog tijela', trajanje: '60 min', cijena: 40.00 },
        { id: 2, naziv: 'Aromaterapijska masaža', trajanje: '45 min', cijena: 35.00 },
        { id: 3, naziv: 'Refleksologija stopala', trajanje: '30 min', cijena: 25.00 },
        { id: 4, naziv: 'Masaža vrućim kamenjem', trajanje: '75 min', cijena: 55.00 },
        { id: 5, naziv: 'Piling tijela + masaža', trajanje: '50 min', cijena: 38.00 },
        { id: 6, naziv: 'Antistres masaža glave i vrata', trajanje: '20 min', cijena: 18.00 },
        { id: 7, naziv: 'Sportska masaža', trajanje: '60 min', cijena: 45.00 },
        { id: 8, naziv: 'Masaža za trudnice', trajanje: '40 min', cijena: 30.00 },
        { id: 9, naziv: 'Luksuzni tretman lica', trajanje: '55 min', cijena: 42.00 },
        { id: 10, naziv: 'Detox tretman tijela', trajanje: '70 min', cijena: 50.00 },
    ]);

    function getById2(id) {
        return tretmani.value.find(t => t.id === Number(id))
    }

    return { tretmani, getById2 }

}, { persist: true })