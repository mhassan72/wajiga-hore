import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/services/firebase'; // Import the initialized Firebase app
import { routes } from './routes';
import { fetchProfile } from '@/store/user/profile'


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication status
router.beforeEach(async  (to, from, next) => {
  const auth = getAuth(app); // Use the initialized app
  const user = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Route requires authentication
    if (!user) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresUnauth)) {
    // Route requires unauthenticated user
    if (user) {
      await fetchProfile(user.uid)
      next({ name: 'profile', params: { uid: user.uid } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;