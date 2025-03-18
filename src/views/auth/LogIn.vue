<template>
  <div class="auth">
    <h1>Sign In</h1>

    <!-- Email & Password Form -->
    <div v-if="!user">
      <div class="sign_in_form">
        <div class="field">
          <input v-model="user_auth.email" placeholder="Gali Ciwaan kaga!" type="email" />
        </div>
      </div>

      <div class="sign_in_form">
          <div class="field">
            <input v-model="user_auth.password" placeholder="*******" type="password" />
          </div>
      </div>

      <div class="action">
        <button  @click="handleLogin">Sign In</button>
      </div>
    </div>

    <!-- Display User Info -->
    <div v-if="user">
      <h2>Welcome, {{ user.displayName || user.email }}!</h2>
      <button @click="signOut">Sign Out</button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEmailAuth } from '@/composables/usePhoneAuth';
import '@/assets/styles/views/auth/form.scss'

const { user, error, signIn, register, signOut } = useEmailAuth();
const user_auth = ref({
  email: '',
  password: '',
  displayName: ''
})

// Handle Login
const handleLogin = async () => {
  await signIn(user_auth.value.email, user_auth.value.password);
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1em;
}
</style>
