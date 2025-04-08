<template>
    <div>
      <TabsNav />
      
      <router-view v-slot="{ Component }">
        <transition 
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
</template>
<script lang="ts" setup>
import TabsNav from '@/components/mobile/TabsNav.vue'
import '@/assets/styles/main.scss'
</script>