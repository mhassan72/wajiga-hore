<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  product: { category: string };
  stages: { aiSelections: { category: boolean } };
  suggetions: { category: string[] };
}>();

const emit = defineEmits(['update-product-category', 'toggle-next-stage']);
</script>

<template>
  <div class="field" v-if="stages.aiSelections.category">
    <label for="product_category">Astaamaha Laguyaqaano Badeecadaan!</label>
    <select id="product_category" v-model="product.category" @change="emit('update-product-category', product.category)">
      <option disabled value="">Select a Category...</option>
      <option v-for="(item, index) in suggetions.category" :key="index" :value="item">
        {{ item }}
      </option>
    </select>

    <button class="continue" @click="emit('toggle-next-stage')">Continue ...</button>
  </div>
</template>
