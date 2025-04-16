<script setup lang="ts">
const props = defineProps<{
  product: { stock: number };
  stages: { aiSelections: { stock: boolean } };
}>();

const emit = defineEmits(["update-product-stock", "toggle-next-stage"]);
</script>

<template>
  <div class="field" v-if="stages.aiSelections.stock">
    <label for="product_stock">Stock</label>
    <input
      type="number"
      id="product_stock"
      placeholder="Product Stock..."
      v-model="product.stock"
      min="0"
      @input="emit('update-product-stock', product.stock)"
    />

    <button class="continue" @click="emit('toggle-next-stage')">
      Sii wad...
    </button>
  </div>
</template>
