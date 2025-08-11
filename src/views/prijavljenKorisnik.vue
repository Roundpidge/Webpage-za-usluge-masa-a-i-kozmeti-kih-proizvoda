<script setup>

import { ref } from 'vue'

const placeholderREF=ref(true)

const stilInputa=ref('border-blue-600 border-2 rounded-lg bg-blue-200 mb-3 p-1 flex flex-col items-center');
const stilForme=ref('inline-block border-blue-600 bg-white border-4 rounded-lg mt-2 p-2');
</script>

<template>
    
    <h1>Korisnik: {{  }}</h1>
    <img src="@/assets/placeholder.jpeg"></img>
    <hr></hr>
    <div v-if="placeholderREF">Da Da da</div>
    <div v-else> Ne ne ne</div>
</template>

<style scoped>
</style>