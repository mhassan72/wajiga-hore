<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  product: { sellerInfo: { location: string } };
  stages: { aiSelections: { location: boolean } };
}>();

const emit = defineEmits(['toggle-next-stage']);
</script>

<template>
  <section v-if="stages.aiSelections.location">
    <div class="field">
      <label for="seller_location">Seller Location</label>
      <input
        type="text"
        id="seller_location"
        placeholder="Seller Location..."
        v-model="props.product.sellerInfo.location"
      />
    </div>
    <button class="continue" @click="emit('toggle-next-stage')">Continue ...</button>
  </section>
</template>
