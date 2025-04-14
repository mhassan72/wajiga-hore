import OverView from '@/views/shop/dashboard/OverView.vue';
import NewProduct from '@/views/shop/dashboard/NewProduct.vue';
import IndexView from '@/views/shop/dashboard/IndexView.vue';
import ProductDetails from '@/views/shop/dashboard/ProductDetails.vue';

export const shopRoutes = {
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
}