<template>
 <h1> Stranica {{ $route.path }} ne postoji! </h1>
 <img src="@/assets/NotFoundImage.jpg" class="h-100"></img>
  <RouterLink to="/" class="hover:text-orange-600 underline">Natrag na početnu stranicu</RouterLink>
</template>