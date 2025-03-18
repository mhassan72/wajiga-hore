import { ref } from 'vue';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter } from 'vue-router';
import { profile, fetchProfile } from '@/store/user/profile';

// Initialize Firebase user state
const user = ref<User | null>(null);

export function useEmailAuth() {
  const error = ref<string | null>(null);
  const router = useRouter();

  // Listen for authentication state changes
  onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser;
    if (firebaseUser) {
      profile.value = {
        id: firebaseUser.uid,
        data: firebaseUser,
      };
      await fetchProfile(firebaseUser.uid);
    } else {
      profile.value = { id: '', data: null };
    }
  });

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      user.value = result.user;
      profile.value = {
        id: result.user.uid,
        data: result.user,
      };
      error.value = null;
      await fetchProfile(result.user.uid);
      router.push(`/profile/${result.user.uid}`);
    } catch (err) {
      error.value = (err as Error).message;
      console.error('Sign-In Error:', err);
    }
  };

  // Register a new user with email, password, and display name
  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      user.value = result.user;
      profile.value = {
        id: result.user.uid,
        data: result.user,
      };
      error.value = null;
      await fetchProfile(result.user.uid);
      router.push(`/profile/${result.user.uid}`);
    } catch (err) {
      error.value = (err as Error).message;
      console.error('Registration Error:', err);
    }
  };

  // Sign out the user
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      user.value = null;
      profile.value = { id: '', data: null };
      error.value = null;
      router.push('/auth/login');
    } catch (err) {
      error.value = (err as Error).message;
      console.error('Sign-Out Error:', err);
    }
  };

  return {
    user,
    error,
    signIn,
    register,
    signOut,
  };
}
