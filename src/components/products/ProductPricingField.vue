<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  product: { price: number; currency: string };
  stages: { aiSelections: { pricing: boolean } };
}>();

const emit = defineEmits(['update-product-price', 'update-product-currency', 'toggle-next-stage']);
</script>

<template>
  <div class="pricing" v-if="stages.aiSelections.pricing">
    <!-- Product Price -->
    <div class="field">
      <label for="product_price">Price</label>
      <input
        type="number"
        id="product_price"
        placeholder="Product Price..."
        v-model="product.price"
        min="0"
        @input="emit('update-product-price', product.price)"
      />
    </div>

    <!-- Product Currency -->
    <div class="field">
      <label for="product_currency">Currency</label>
      <select
        id="product_currency"
        v-model="product.currency"
        @change="emit('update-product-currency', product.currency)"
      >
        <option value="SOM">SHILIN SOMALI</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>
    </div>

    <button class="continue" @click="emit('toggle-next-stage')">Continue ...</button>
  </div>
</template>
