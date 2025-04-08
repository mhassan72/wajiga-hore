<template>
    <div class="hints">
      <div class="hint" v-if="register">
        <p>Ma lihid akoon? <router-link to="/auth/register">Samee</router-link>!</p>
      </div>
  
      <div class="hint" v-if="login">
        <p>Horay ma u lahayd akoon? <router-link to="/auth/login">Gudaha u gal</router-link>!</p>
      </div>
  
      <div class="hint" v-if="forgotPassword">
        <p>Ma hilmaantay erayga sirta ah? <router-link to="/auth/forgot-password">Dib u cusbooneysii</router-link>!</p>               
      </div>
  
      <div class="hint" v-if="terms">
        <p>
          Aqri <router-link to="/terms">Shuruudaha Isticmaalka</router-link> iyo
          <router-link to="/privacy">Siyaasadda Qarsoodiga</router-link>.
        </p>   
      </div>
    </div>
</template>
  
<script lang="ts" setup>
  defineProps<{
    login?: boolean
    register?: boolean
    forgotPassword?: boolean
    resetPassword?: boolean
    terms?: boolean
  }>()
</script>
<style>
    a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 600;
    }
</style>
  