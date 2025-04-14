import HomeView from '@/views/HomeView.vue';
import ProfileView from '@/views/user/ProfileView.vue';
import ChatListView from '@/views/chat/ListView.vue';
import BrowseView from '@/views/browse/RecomView.vue';
import WishListView from '@/views/whishlist/ListView.vue';
import NewShop from '@/views/shop/NewShop.vue';


export const otherRoutes = {
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
}