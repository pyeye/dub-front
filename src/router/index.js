import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import DubCatalog from '@/pages/DubCatalog';
import DubCatalogList from '@/components/catalog/DubCatalogList';
import DubCatalogDetail from '@/components/catalog/DubCatalogDetail';
import DubCart from '@/pages/DubCart';
import DubAuth from '@/pages/DubAuth';
import DubUser from '@/pages/DubUser';
import DubHome from '@/pages/DubHome';
import DubNews from '@/pages/DubNews';
import DubUserProfile from '@/components/user/DubUserProfile';
import DubUserOrders from '@/components/user/DubUserOrders';
import DubUserDoneOrders from '@/components/user/DubUserDoneOrders';
import DubUserCarts from '@/components/user/DubUserCarts';
import DubUserRatings from '@/components/user/DubUserRatings';
import DubCartInfo from '@/components/cart/DubCartInfo';
import DubCartOrder from '@/components/cart/DubCartOrder';
import DubAuthLogin from '@/components/auth/DubAuthLogin';
import DubAuthRegister from '@/components/auth/DubAuthRegister';
import DubNewsList from '@/components/news/DubNewsList';
import DubNewsDetail from '@/components/news/DubNewsDetail';

Vue.use(Router);


const routes = [
  {
    path: '',
    name: 'DubHome',
    component: DubHome,
  },
  {
    path: '/catalog/:category',
    component: DubCatalog,
    children: [
      {
        path: '',
        name: 'DubCatalogList',
        component: DubCatalogList,
      },
      {
        path: ':id',
        name: 'DubCatalogDetail',
        component: DubCatalogDetail,
      },
    ],
  },
  {
    path: '/news',
    component: DubNews,
    children: [
      {
        path: '',
        name: 'DubNewsList',
        component: DubNewsList,
      },
      {
        path: ':id',
        name: 'DubNewsDetail',
        component: DubNewsDetail,
      },
    ],
  },
  {
    path: '/cart',
    name: 'DubCart',
    component: DubCart,
    children: [
      {
        path: 'info',
        alias: '/',
        name: 'DubCartInfo',
        component: DubCartInfo,
      },
      {
        path: 'order',
        name: 'DubCartOrder',
        component: DubCartOrder,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    name: 'DubAuth',
    component: DubAuth,
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        alias: '/',
        name: 'DubAuthLogin',
        component: DubAuthLogin,
      },
      {
        path: 'register',
        name: 'DubAuthRegister',
        component: DubAuthRegister,
      },
    ],
  },
  {
    path: '/user',
    name: 'DubUser',
    component: DubUser,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        alias: '/',
        name: 'DubUserProfile',
        component: DubUserProfile,
      },
      {
        path: 'orders',
        name: 'DubUserOrders',
        component: DubUserOrders,
      },
      {
        path: 'archive',
        name: 'DubUserDoneOrders',
        component: DubUserDoneOrders,
      },
      {
        path: 'templates',
        name: 'DubUserCarts',
        component: DubUserCarts,
      },
      {
        path: 'ratings',
        name: 'DubUserRatings',
        component: DubUserRatings,
      },
    ],
  },
];

const router = new Router({ routes, mode: 'history' });

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // этот путь требует авторизации, проверяем залогинен ли
    // пользователь, и если нет, перенаправляем на страницу логина
    if (store.getters['user/isAuthenticated']) {
      next();
    } else {
      next({
        path: '/auth',
        query: { redirect: to.fullPath },
      });
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // этот путь доступен тольлоко для не залогиненных пользователей
    if (!store.getters['user/isAuthenticated']) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
