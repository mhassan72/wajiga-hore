<template>
  <transition
    enter-active-class="animate__animated animate__fadeInUp"
    leave-active-class="animate__animated animate__fadeOutDown"
  >
    <div class="wrapper">
      <RouterLink to="/">
        <div>
          <IconHome />
        </div>
      </RouterLink>
      <RouterLink :to="`/profile/${profile.id}`">
        <div>
          <IconUser />
        </div>
      </RouterLink>
      <RouterLink :to="routeNewProduct">
        <div class="bg-color">
          <svg
            id="icon-plus"
            fill="currentColor"
            width="26"
            height="26"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"
            ></path>
          </svg>
        </div>
      </RouterLink>
      <RouterLink to="/favourite">
        <div>
          <IconSupport />
        </div>
      </RouterLink>
      <RouterLink to="/chats">
        <div>
          <IconCommunity />
        </div>
      </RouterLink>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import "@/assets/styles/components/tabs.scss";
import IconHome from "@/components/icons/IconHome.vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconSupport from "@/components/icons/IconSupport.vue";
import IconCommunity from "@/components/icons/IconCommunity.vue";
import { profile } from "@/store/user/profile";

import { useRoute } from "vue-router";

const route = useRoute();

const routeNewProduct = `/sheycusub/${profile.value.id}`;
</script>
