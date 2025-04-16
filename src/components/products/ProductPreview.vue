<template>
  <div class="product-preview">
    <div class="images">
      <img
        v-for="(image, index) in product.images"
        :src="image"
        :key="index"
        alt="Product Image"
        class="productImage"
      />
    </div>

    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <div class="chips-custom">
        <div class="chip">{{ product.category }}</div>
        <div class="chip">{{ product.sellerInfo.location }}</div>
      </div>

      <p>{{ product.description }}</p>
      <p>{{ product.subcategory }}</p>

      <h3>${{ product.price }}</h3>
      <p>Currency: {{ product.currency }}</p>
      <p v-for="(attr, index) in product.attributes" :key="index">
        {{ attr.key }}: {{ attr.value }}
      </p>
      <p>Return Policy: {{ product.sellerInfo.returnPolicy }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import "@/assets/styles/components/product_preview.scss";
defineProps<{
  product: Object;
}>();
</script>
