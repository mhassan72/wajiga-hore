<template>
  <div class="listByCat animate__animated animate__fadeInUp">
    <div
      v-for="[category, productList] in Object.entries(productsByCategory)"
      :key="category"
      class="category-group"
    >
      <h3>{{ category }}</h3>

      <div class="products-grid">
        <div
          v-for="product in productList"
          :key="product.id"
          class="product-card"
        >
          <router-link :to="`/product/${product.uid}`">
            <div class="image-wrapper">
              <div
                class="image"
                :style="{ backgroundImage: `url(${product.images[0]})` }"
              ></div>
            </div>
            <div class="product-info">
              <p class="product-title">{{ product.name }}</p>
              <p class="product-price">{{ formatPrice(product.price) }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <button @click="fetchProducts" :disabled="isLoading">Load More</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { products, fetchProducts, isLoading } from "@/composables/useProducts";

import "@/assets/styles/components/listByCat.scss";

const productsByCategory = computed(() => {
  const grouped: Record<string, typeof products.value> = {};
  products.value.forEach((product) => {
    const category = product.category || "Uncategorized";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(product);
  });
  return grouped;
});

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

onMounted(() => {
  fetchProducts();
});
</script>
