import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true }, // <-- Add meta
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                }
            ]
        },
        {
            path: '/oauth/success',
            name: 'oauth-success',
            component: () => import('@/views/OauthSuccess.vue')
        },
        {
            path: '/oauth/error',
            name: 'oauth-error',
            component: () => import('@/views/OauthError.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('token'); // or sessionStorage, as needed

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLoggedIn) {
            next({ name: 'login' });
        } else {
            next();
        }
    } else if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
        // Prevent logged-in users from seeing login/register
        next({ name: 'dashboard' });
    } else {
        next();
    }
});

export default router;
