import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase.js'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import regLog from '@/views/RegisterAndLogin.vue'
import products from '@/views/products.vue'
import tretmani from '@/views/tretmani.vue'
import korisnik from '@/views/prijavljenKorisnik.vue'
import logout from '@/views/logout.vue'
import NotFound from '@/views/NotFound.vue'
import admin from '@/views/ADMINlogin.vue'
import adminPage from '@/views/ADMINMain.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/registerLogin', component: regLog },
    { path: '/registerLogin', name: 'login', component: regLog },
    { path: '/logout', component: logout },
    { path: '/products', component: products },
    { path: '/tretmani', component: tretmani },
    { path: '/admin', component: admin },

    {
        path: '/proizvodDetaljno/:id',
        name: 'productsDetails',
        component: () => import('../views/productsDetails.vue'),
        props: true
    },


    {
        path: '/tretmanDetaljno/:id',
        name: 'tretmaniDetails',
        component: () => import('@/views/tretmaniDetails.vue'),
        props: true
    },

    {
        path: '/korisnik/:email',
        name: 'korisnik',
        component: korisnik
    },

    {
        path: '/adminPage/:email',
        name: 'adminPage',
        component: adminPage
    },

    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
  const isAuthenticated = !!auth.currentUser
  if (!isAuthenticated && to.name === 'korisnik') {
    return { name: 'login' }
  }
})

export default router
