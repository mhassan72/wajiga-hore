<script setup lang="ts">
const props = defineProps<{
  product: { status: string };
  stages: { aiSelections: { status: boolean } };

}>();

const emit = defineEmits(['update-product-status', 'toggle-next-stage']);
</script>

<template>
  <div class="field" v-if="stages.aiSelections.status">
    <label for="product_status">Status</label>
    <select
      id="product_status"
      v-model="product.status"
      @change="emit('update-product-status', product.status)"
    >
      <option value="active">Active</option>
      <option value="sold">Sold</option>
      <option value="archived">Archived</option>
      <option value="pending">Pending</option>
    </select>

    <button class="continue" @click="emit('toggle-next-stage')">Continue ...</button>
  </div>
</template>
