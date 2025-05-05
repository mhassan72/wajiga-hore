import { RouteRecordRaw } from "vue-router";
import ConvoView from "@/views/chat/ConvoView.vue";
import Myshop from "@/views/shop/Myshop.vue";
import NewProduct from "@/views/shop/dashboard/NewProduct.vue";
import PaymentMethods from "@/views/user/PaymenMethods.vue";

import { auth } from "./auth";
import { shopRoutes } from "./shop";
import { otherRoutes } from "./other";

export const routes: Array<RouteRecordRaw> = [
  otherRoutes,
  {
    path: "/product/:productId",
    name: "product",
    component: () => import("@/views/browse/ProductDetail.vue"), // ✅ Fixed alias
    meta: { requiresAuth: false },
  },
  {
    path: "/shop/:userId",
    name: "my-shop",
    component: Myshop,
    meta: { requiresAuth: true },
  },
  shopRoutes,
  {
    path: "/chat/:chatId",
    name: "chatdetails",
    component: ConvoView,
    meta: { requiresAuth: true },
  },
  auth, // ✅ Fixed import
  {
    path: "/sheycusub/:userId",
    name: "sheycusub",
    component: NewProduct,
  },
  {
    path: "/lacag-bixinta/:uid",
    name: "lacag-bixinta",
    component: PaymentMethods,
    meta: { requiresAuth: true },
  },
];
