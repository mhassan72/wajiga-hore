<template>
    <div>
      <h1>Phone Number Authentication</h1>
  
      <!-- Step 1: Enter Phone Number -->
      <div v-if="!user">
        <input v-model="phoneNumber" placeholder="Enter your phone number" />
        <button @click="handleSendOtp">Send OTP</button>
      </div>
  
      <!-- Step 2: Enter OTP -->
      <div v-if="confirmationResult && !user">
        <input v-model="otp" placeholder="Enter OTP" />
        <button @click="handleVerifyOtp">Verify OTP</button>
      </div>
  
      <!-- Step 3: Display User Info -->
      <div v-if="user">
        <h2>Welcome, {{ user.displayName || user.phoneNumber }}!</h2>
        <button @click="signOut">Sign Out</button>
      </div>
  
      <!-- Error Message -->
      <div v-if="error" style="color: red;">
        Error: {{ error }}
      </div>
  
      <!-- reCAPTCHA Container -->
      <div id="recaptcha-container"></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { usePhoneAuth } from '@/composables/usePhoneAuth';
  
  const { user, error, sendOtp, verifyOtp, register, signOut, initializeRecaptcha } = usePhoneAuth();
  
  const phoneNumber = ref('');
  const otp = ref('');
  const confirmationResult = ref<any>(null);
  
  // Initialize reCAPTCHA on component mount
  onMounted(async () => {
    await initializeRecaptcha('recaptcha-container');
  });
  
  // Handle sending OTP
  const handleSendOtp = async () => {
    await sendOtp(phoneNumber.value);
    confirmationResult.value = true; // Set confirmation result
  };
  
  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    await verifyOtp(otp.value);
  };
  </script>