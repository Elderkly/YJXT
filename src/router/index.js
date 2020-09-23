import Vue from 'vue'
import Router from 'vue-router'

import Home from '../page/Home'
import Administer from '../page/Administer'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/Administer',
            name: 'Administer',
            component: Administer
        }
    ]
})
