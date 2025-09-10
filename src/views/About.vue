<script setup>
import gumb2 from '@/components/gumbVanNavbar.vue'
import naslov from '@/components/naslov.vue'
import tekst from '@/components/tekst.vue'
</script>

<template>
   <div class="text-center px-6">
   <naslov>O nama</naslov><br></br>
   <tekst>
   <ol>
   <li><strong>Telefon:</strong> 098/999-0989</li>
   <li><strong>Email:</strong> TaraTaric@gmail.com</li>
   <li><strong>Lokacija:</strong> Zagrebačka 16, Pula 52100</li>
   </ol>
   </tekst>
   <br></br>
   <a href="https://www.google.com/maps/search/Zagreba%C4%8Dka+16,+Pula+52100/@44.8624686,13.8310684,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D"><gumb2>Put do nas</gumb2></a>
   </div>
</template>

<style scoped></style>

