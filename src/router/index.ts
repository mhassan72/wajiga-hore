import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase"; // Import the initialized Firebase app
import { routes } from "./routes";
import { fetchProfile } from "@/store/user/profile";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication status
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      next({ name: "login" });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresUnauth)) {
    if (user) {
      await fetchProfile((user as any).uid);
      next({ name: "profile", params: { uid: (user as any).uid } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
