<template>
  <div>
    <TabsNav />

    <router-view v-slot="{ Component }" :key="route.path">
      <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";

import TabsNav from "@/components/mobile/TabsNav.vue";
import "@/assets/styles/main.scss";

const route = useRoute();
</script>
