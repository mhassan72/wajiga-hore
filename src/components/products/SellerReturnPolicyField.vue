<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  product: { sellerInfo: { returnPolicy: string } };
  stages: { aiSelections: { seller_return_policy: boolean } };
}>();

const emit = defineEmits(['toggle-next-stage']);
</script>

<template>
  <section v-if="stages.aiSelections.seller_return_policy">
    <div class="field">
      <label for="seller_return_policy">Return Policy</label>
      <select
        id="seller_return_policy"
        v-model="props.product.sellerInfo.returnPolicy"
      >
        <option value="NONE">No Return Policy</option>
        <option value="14_DAYS">14 Days Return</option>
        <option value="30_DAYS">30 Days Return</option>
      </select>
    </div>
    <button class="continue" @click="emit('toggle-next-stage')">Continue ...</button>
  </section>
</template>
