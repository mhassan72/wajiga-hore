<template>
  <div class="reset-password">
    <h1>Codso Badal</h1>

    <div class="sign_in_form">
      <div class="field">
        <label for="email">Email kaga /  Ciwaan</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Ciwaan/ Email kaga"
          required
        />
      </div>

      <button @click="handleReset" :disabled="loading">
        {{ loading ? 'Hool...' : 'Codso Linkiga' }}
      </button>

      <SharedPartials :terms="true" :register="true" />
    </div>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/services/firebase'
import SharedPartials from '@/components/auth/SharedPartials.vue'
import { translateFirebaseErrorToSomali } from '@/utils/firebaseErrorSomali'

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleReset = async () => {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    await sendPasswordResetEmail(auth, email.value)
    message.value = 'Password reset email sent. Please check your inbox.'
    email.value = ''
  } catch (err: any) {
    error.value = translateFirebaseErrorToSomali(err.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.reset-password {
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
  padding-top: 10vh;

  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .sign_in_form {
    padding: 1.5rem;
    border-radius: 12px;
  }

  .field {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    label {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    input {
      padding: 10px;
      font-size: 1rem;
      background: none;
      border: 2px solid var(--primary-color);
      border-radius: 6px;
      color: inherit;
      outline: none;
    }
  }

  button {
    padding: 10px;
    font-size: 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:disabled {
      background-color: var(--primary-color);
      cursor: not-allowed;
    }
  }

  .success {
    color: green;
    margin-top: 1em;
    text-align: center;
  }

  .error {
    color: red;
    margin-top: 1em;
    text-align: center;
  }
}
</style>
