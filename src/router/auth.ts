import LogIn from '@/views/auth/LogIn.vue';
import RegisterNew from '@/views/auth/RegisterNew.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';


export const auth = {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/EntryPoint.vue'), // ✅ Fixed alias
    meta: { requiresUnauth: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: LogIn,
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterNew,
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassword, // ✅ Fixed alias
      }
    ],
}