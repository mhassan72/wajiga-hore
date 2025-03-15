<template>
    <div>
      <h1>Register</h1>
      <div>
        <label for="phone">Phone Number:</label>
        <input
          type="text"
          id="phone"
          v-model="phoneNumber"
          placeholder="+1234567890"
        />
        <button @click="sendOtp(phoneNumber)">Send OTP</button>
      </div>
      <div v-if="confirmationSent">
        <label for="otp">OTP:</label>
        <input type="text" id="otp" v-model="otp" />
        <label for="displayName">Display Name:</label>
        <input
          type="text"
          id="displayName"
          v-model="displayName"
          placeholder="Your Name"
        />
        <button @click="handleRegister">Register</button>
      </div>
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <div v-if="user">
        <p>Registered successfully as: {{ user.displayName }}</p>
      </div>
      <!-- This container is required for the reCAPTCHA widget -->
      <div id="recaptcha-container"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { usePhoneAuth } from '@/composables/usePhoneAuth';
  
  const phoneNumber = ref('');
  const otp = ref('');
  const displayName = ref('');
  
  const { user, error, sendOtp, register, initializeRecaptcha } = usePhoneAuth();
  const confirmationSent = ref(false);
  
  // Initialize reCAPTCHA on component mount.
  onMounted(() => {
    initializeRecaptcha('recaptcha-container');
  });
  
  // Watch for confirmation result to display OTP & registration fields.
  watch(user, (newVal) => {
    if (newVal) {
      // Registration completed.
    }
  });
  
  const handleSendOtp = async () => {
    await sendOtp(phoneNumber.value);
    confirmationSent.value = true;
  };
  
  const handleRegister = async () => {
    await register(otp.value, displayName.value);
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
    margin-top: 1em;
  }
  </style>
  