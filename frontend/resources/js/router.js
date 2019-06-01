import VueRouter from 'vue-router';
import DefaultLayout from './components/template/DefaultLayout';

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Vue.component('login'),
    },
    {
        path: '',
        component: DefaultLayout,
        children: [
            {
                path: '/projetos/listar',
                component: Vue.component('listagem-projeto'),
            },
            {
                path: '/projetos/criar',
                component: Vue.component('projeto'),
            },
            {
                path: '/projetos/editar/:id',
                component: Vue.component('projeto'),
            },
        ],
    },
];

const router = new VueRouter({
    mode: 'history',
    routes: routes,
});

router.beforeEach((to, from, next) => {
    if (to.name === 'login' && localStorage.getItem('authToken')) {
        return next('/');
    }

    return next();
});

if (localStorage.getItem('authToken')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('authToken');
}

axios.interceptors.response.use(response => response, (error) => {

    if (error.request.status) {
        localStorage.removeItem('authToken');
        sessionStorage.setItem('intended', router.currentRoute.fullPath);
        router.push('/login');
    }

    return error;
});

export default router;