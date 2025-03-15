import { ref } from 'vue';
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  updateProfile,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { app } from '@/services/firebase';
import { useRouter } from 'vue-router';

// Initialize Firebase
const auth = getAuth(app); // Initialize Firebase Auth
const user = ref<User | null>(null);

export function usePhoneAuth() {
  const error = ref<string | null>(null);
  const confirmationResult = ref<ConfirmationResult | null>(null);
  const recaptchaVerifier = ref<RecaptchaVerifier | null>(null);

  // Listen for auth state changes
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });

  // Initialize reCAPTCHA verifier
  const initializeRecaptcha = (elementId: string) => {
    recaptchaVerifier.value = new RecaptchaVerifier(
      auth,
      elementId,
      {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
      }
    );
  };

  // Send OTP to the user's phone number
  const sendOtp = async (phoneNumber: string) => {
    if (!recaptchaVerifier.value) {
      error.value = 'reCAPTCHA verifier is not initialized.';
      return;
    }

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.value);
      confirmationResult.value = result;
      error.value = null;
    } catch (err) {
      error.value = (err as Error).message;
      console.error('OTP Send Error:', err);
    }
  };

  // Verify the OTP entered by the user (for sign in)
  const verifyOtp = async (otp: string, router: ReturnType<typeof useRouter>) => {
    if (!confirmationResult.value) {
      error.value = 'Confirmation result is missing. Please send OTP again.';
      return;
    }

    try {
      const result = await confirmationResult.value.confirm(otp);
      user.value = result.user;
      error.value = null;
      router.push(`/profile/${result.user.uid}`);
    } catch (err) {
      error.value = (err as Error).message;
      console.error('OTP Verification Error:', err);
    }
  };

  // Register a new user with additional profile info
  const register = async (otp: string, displayName: string, router: ReturnType<typeof useRouter>) => {
    if (!confirmationResult.value) {
      error.value = 'Confirmation result is missing. Please send OTP again.';
      return;
    }
    try {
      const result = await confirmationResult.value.confirm(otp);
      user.value = result.user;
      await updateProfile(result.user, { displayName });
      error.value = null;
      router.push(`/profile/${result.user.uid}`);
    } catch (err) {
      error.value = (err as Error).message;
      console.error('Registration Error:', err);
    }
  };

  // Sign out the user and clear persistent state
  const signOut = async (router: ReturnType<typeof useRouter>) => {
    try {
      await auth.signOut();
      user.value = null;
      error.value = null;
      confirmationResult.value = null;
      if (recaptchaVerifier.value) {
        recaptchaVerifier.value.clear();
        recaptchaVerifier.value = null;
      }
      router.push('/auth/login');
    } catch (err) {
      error.value = (err as Error).message;
      console.error('Sign-Out Error:', err);
    }
  };

  return {
    user,
    error,
    sendOtp,
    verifyOtp,
    register,
    signOut,
    initializeRecaptcha,
  };
}
