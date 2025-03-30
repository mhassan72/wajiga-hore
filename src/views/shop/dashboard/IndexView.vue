<template>
  <div>
    <TabsNavShop />
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import TabsNavShop from "@/components/mobile/TabsNavShop.vue";
import "@/assets/styles/main.scss";
</script>
