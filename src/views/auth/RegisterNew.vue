<template>
  <div class="register-form">
    <h1>Diwan gelin</h1>

    <div v-if="user">
      <p>Waad is Diwaan galisey Magaca: {{ user?.displayName }}</p>
    </div>

    <div v-if="error" class="error">{{ error }}</div>


    <div class="sign_in_form">

      <div class="field">
        <label for="displayName">Magacaaga</label>
        <input type="text" id="displayName" v-model="displayName" placeholder="Magacaaga" required />
      </div>

      <div class="field">
        <label for="email">Ciwaankaga ama Email kaga</label>
        <input type="email" id="email" v-model="email" placeholder="ciwaan@example.com" required />
      </div>

      <div class="field">
        <label for="password">Sirta</label>
        <input type="password" id="password" v-model="password" placeholder="Geli Sirtaada" required />
      </div>

      

      <button @click="handleRegister" :disabled="isLoading">
        {{ isLoading ? 'Diwaan galin...' : 'Diwaan geli' }}
      </button>


      <SharedPartials :terms="true" :login="true" />
    </div>

    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmailAuth } from '@/composables/usePhoneAuth'
import { useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase'
import SharedPartials from '@/components/auth/SharedPartials.vue'
import { translateFirebaseErrorToSomali } from '@/utils/firebaseErrorSomali'

const email = ref('')
const password = ref('')
const displayName = ref('')
const isLoading = ref(false)

const router = useRouter()
const { user, error, register } = useEmailAuth()

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      router.push({ name: 'browse' })
    }
  })
})

const handleRegister = async () => {
  isLoading.value = true
  error.value = null

  try {
    await register(email.value, password.value, displayName.value)

    // Reset form fields
    email.value = ''
    password.value = ''
    displayName.value = ''
  } catch (err) {
    console.error('Registration Error:', err)
    error.value = translateFirebaseErrorToSomali(err.code || '')
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-form {
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
      width: 100%;
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

  .error {
    color: red;
    margin-top: 1em;
    text-align: center;
  }
}
</style>