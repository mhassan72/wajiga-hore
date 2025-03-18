<template>
  <div>
    <h1>Register</h1>
    <div>
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="you@example.com"
      />
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter your password"
      />
      <label for="displayName">Display Name:</label>
      <input
        type="text"
        id="displayName"
        v-model="displayName"
        placeholder="Your Name"
      />
      <button @click="handleRegister">Register</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="user">
      <p>Registered successfully as: {{ user.displayName }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEmailAuth } from '@/composables/usePhoneAuth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const displayName = ref('');
const router = useRouter();
const { user, error, register } = useEmailAuth();

// Handle Registration
const handleRegister = async () => {
  try {
    await register(email.value, password.value, displayName.value);
  } catch (err) {
    console.error('Registration Error:', err);
  }
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1em;
}
</style>
