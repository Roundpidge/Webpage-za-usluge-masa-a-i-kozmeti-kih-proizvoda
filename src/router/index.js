import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import reg from '@/views/Register.vue'
import log from '@/views/login.vue'
import products from '@/views/products.vue'
import tretmani from '@/views/tretmani.vue'
import korisnik from '@/views/prijavljenKorisnik.vue'
import logout from '@/views/logout.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/register', component: reg },
    { path: '/login', component: log },
    { path: '/logout', component: logout },
    { path: '/products', component: products },
    { path: '/tretmani', component: tretmani },
    { path: '/korisnik', component: korisnik },

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
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
