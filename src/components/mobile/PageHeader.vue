<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import BackBtn from "./BackBtn.vue";
import IconSupport from "@/components/icons/IconSupport.vue";

const props = defineProps<{
  title?: string;
  product?: string;
  menu?: boolean;
  chat?: boolean;
}>();

const route = useRoute();

import { useFav } from "@/composables/useFav";

const { isFavorite, checkIfFavorite, toggleFavorite } = useFav();
const productId = `${props.product}`;

onMounted(() => {
  checkIfFavorite(productId);
});
</script>

<template>
  <div class="page_header">
    <BackBtn />

    <h1 class="page_title" v-if="title">{{ title }}</h1>

    <div class="product" v-if="product">
      <button
        class="btn-clear"
        :class="{ favorite: isFavorite }"
        @click="toggleFavorite(productId)"
      >
        <IconSupport :class="{ active: isFavorite }" v-if="isFavorite" />
        <svg
          width="20"
          height="20"
          fill="currentColor"
          v-else
          viewBox="0 0 18 19"
        >
          <path
            d="M17.19 4.156c-1.672-1.535-4.383-1.535-6.055 0l-1.135 1.041-1.136-1.041c-1.672-1.535-4.382-1.535-6.054 0-1.881 1.726-1.881 4.519 0 6.245l7.19 6.599 7.19-6.599c1.88-1.726 1.88-4.52 0-6.245zM16.124 9.375l-6.124 5.715-6.125-5.715c-0.617-0.567-0.856-1.307-0.856-2.094s0.138-1.433 0.756-1.999c0.545-0.501 1.278-0.777 2.063-0.777s1.517 0.476 2.062 0.978l2.1 1.825 2.099-1.826c0.546-0.502 1.278-0.978 2.063-0.978s1.518 0.276 2.063 0.777c0.618 0.566 0.755 1.212 0.755 1.999s-0.238 1.528-0.856 2.095z"
          ></path>
        </svg>
      </button>
    </div>

    <button class="options" v-if="menu">
      <svg
        id="icon-more-vertical"
        fill="currentColor"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          d="M14 12c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 5c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 19c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414z"
        ></path>
      </svg>
    </button>

    <button class="options" v-if="chat">
      <svg
        id="icon-more-vertical"
        fill="currentColor"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          d="M14 12c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 5c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 19c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.btn-clear {
  background: none;
  color: inherit;
}

.active {
  color: #ff6b6b;
}
</style>
