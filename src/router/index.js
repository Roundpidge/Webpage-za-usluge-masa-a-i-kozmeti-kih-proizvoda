import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase.js'


import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import reg from '@/views/Register.vue'
import log from '@/views/login.vue'
import products from '@/views/products.vue'
import tretmani from '@/views/tretmani.vue'
import korisnik from '@/views/prijavljenKorisnik.vue'
import logout from '@/views/logout.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/register', component: reg },
    { path: '/login', component: log },
    { path: '/logout', component: logout },
    { path: '/products', component: products },
    { path: '/tretmani', component: tretmani },

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
        return { name: 'log' }
    }
})

export default router
