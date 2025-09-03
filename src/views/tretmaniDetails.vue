<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useTretmaniStore } from "@/stores/projektStore.js"
import {onAuthStateChanged} from 'firebase/auth'
import { auth } from '@/firebase.js'

const storeT = useTretmaniStore()
const route = useRoute()
const tretman = computed(() => storeT.getById2(route.params.id))
const user=ref(null)

onAuthStateChanged(auth, (currentUser) => {
 if (currentUser) {
 user.value = currentUser;

 } else {
 user.value = null;
 }
});

</script>

<template>
  <div v-if="tretman">
    <h1 class="text-3xl">{{ tretman.naziv }}</h1>
    <ol>
        <li>Trajanje: {{ tretman.trajanje }}</li>
        <li>Cijena: {{ tretman.cijena }}</li>
    </ol>
  </div>
  <div v-else>
    <p>Tretman nije pronađen!</p>
  </div>
<a v-if="user" href="https://docs.google.com/forms/d/e/1FAIpQLSf-PfQg1hO64jKMxPXrskUyo7oXCnRf7qcJtwkA3mNhj7A2Sw/viewform?usp=header" class="border-orange-400 border-3 rounded-lg bg-orange-200 mb-3 p-2">Naruci se</a>
</template>
