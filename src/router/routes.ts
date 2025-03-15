import { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LogIn from '../views/auth/LogIn.vue';
import RegisterNew from '../views/auth/RegisterNew.vue';
import ProfileView from '../views/user/ProfileView.vue';

export const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth/EntryPoint.vue'),
      meta: { requiresUnauth: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: LogIn,
          meta: { requiresUnauth: true },
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterNew,
          meta: { requiresUnauth: true },
        },
      ],
    },
    {
      path: '/profile/:uid',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
  ];
  