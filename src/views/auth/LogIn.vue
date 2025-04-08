<template>
  <div class="auth">
    <h1>Gudaha ugal</h1>

    <div v-if="!user" class="sign_in_form">
      <div class="field">
        <label for="email">Ciwaan / Email kaga</label>
        <input
          id="email"
          v-model="user_auth.email"
          placeholder="Gali ciwaan kaga!"
          type="email"
          required
        />
      </div>

      <div class="field">
        <label for="password">Sirta</label>
        <input
          id="password"
          v-model="user_auth.password"
          placeholder="*******"
          type="password"
          required
        />
      </div>

      <button @click="handleLogin">Gudaha ugal</button>

      <SharedPartials register terms forgotPassword />
    </div>

    <!-- Display User Info -->
    <div v-if="user" class="user-info">
      <h2>Welcome, {{ user.displayName || user.email }}!</h2>
      <button @click="signOut">Sign Out</button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/firebase'
import { useEmailAuth } from '@/composables/usePhoneAuth'
import SharedPartials from '@/components/auth/SharedPartials.vue'
import '@/assets/styles/views/auth/form.scss'

const router = useRouter()
const { user, error, signIn, signOut } = useEmailAuth()

const user_auth = ref({
  email: '',
  password: '',
  displayName: ''
})

const handleLogin = async () => {
  await signIn(user_auth.value.email, user_auth.value.password)
}

onMounted(() => {
  setTimeout(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      router.push({ name: 'browse' })
    }
  }, 3000)
})
</script>

<style scoped lang="scss">
.auth {
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
  }

  .user-info {
    text-align: center;

    button {
      margin-top: 1rem;
      padding: 10px 20px;
      background-color: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  }

  .error {
    color: red;
    margin-top: 1em;
    text-align: center;
  }
}
</style>
