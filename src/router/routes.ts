import { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LogIn from '@/views/auth/LogIn.vue';
import RegisterNew from '@/views/auth/RegisterNew.vue';
import ProfileView from '@/views/user/ProfileView.vue';
import ChatListView from '@/views/chat/ListView.vue';
import BrowseView from '@/views/browse/RecomView.vue';
import WishListView from '@/views/whishlist/ListView.vue';
import ConvoView from '@/views/chat/ConvoView.vue'
import Myshop from '@/views/shop/Myshop.vue';
import NewShop from '@/views/shop/NewShop.vue';
import OverView from '@/views/shop/dashboard/OverView.vue';
import NewProduct from '@/views/shop/dashboard/NewProduct.vue';
import IndexView from '@/views/shop/dashboard/IndexView.vue';
import ProductDetails from '@/views/shop/dashboard/ProductDetails.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
    redirect: '/browse', // ✅ Fixed incorrect redirect
    children: [
      {
        path: 'profile/:uid',
        name: 'profile',
        component: ProfileView,
      },
      {
        path: 'search/:serachTerm',
        name: 'search',
        component: ProfileView,
      },
      {
        path: 'browse',
        name: 'browse',
        component: BrowseView,
      },
      {
        path: 'chats',
        name: 'chatlist',
        component: ChatListView,
      },
      {
        path: 'favourite',
        name: 'favourite',
        component: WishListView,
      },
      {
        path: 'shop/new',
        name: 'new-shop',
        component: NewShop,
      }
    ],
  },
  {
    path: '/product/:productId',
    name: 'product',
    component: () => import('@/views/browse/ProductDetail.vue'), // ✅ Fixed alias
    meta: { requiresAuth: false },
  },
  {
    path: '/shop/:userId',
    name: 'my-shop',
    component: Myshop,
    meta: { requiresAuth: true },
  },
  {
    path: '/shop/:userId/dashboard/:shopId/',
    name: 'shop-overview',
    component: IndexView,
    meta: { requiresAuth: true },
    redirect: 'overview',
    children: [
      {
        path: 'overview',
        name: 'shop-overview-page', // Unique name
        component: OverView,
        meta: { requiresAuth: true },
      },
      {
        path: 'new-product',
        name: 'new-product',
        component: NewProduct,
        meta: { requiresAuth: true },
      },
      {
        path: 'prev/:productId',
        name: 'product-details',
        component: ProductDetails,
        meta: { requiresAuth: true },
      }
    ]
  },
  {
    path: '/chat/:chatId',
    name: 'chatdetails',
    component: ConvoView,
    meta: { requiresAuth: true },
  },
  {
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
  },
];
