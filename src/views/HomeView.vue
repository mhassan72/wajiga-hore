<template>
  <div>
    <TabsNav />
    <router-view/>
  </div>
</template>
<script lang="ts" setup>
import TabsNav from '@/components/mobile/TabsNav.vue'
import '@/assets/styles/main.scss'
</script>