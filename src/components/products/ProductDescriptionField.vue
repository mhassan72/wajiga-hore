<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  product: { description: string };
  stSuggest: { count: number };
  stages: { aiSelections: { description: boolean } };
  suggetions: { descriptions: string[] };
}>();

const emit = defineEmits(['update-product-description', 'toggle-next-stage']);

const updateDescription = (description: string) => {
  emit('update-product-description', description);
};
</script>

<template>
  <div class="field">
    <label for="product_description" v-if="stages.aiSelections.description">Description</label>
    <textarea
      id="product_description"
      placeholder="Product Description..."
      v-model="product.description"
      v-if="stages.aiSelections.description"
    ></textarea>

    <div class="suggestions" v-if="stages.aiSelections.description">
      <div class="callToAction">
        <p> Waxaan kuu sameeyay liis sharraxaado ah. Fadlan dooro midda kugu habboon. </p>
      </div>

      <div
        class="item"
        v-for="(item, index) in suggetions.descriptions"
        :key="index"
        @click="updateDescription(item)"
        :class="{ 'selectedOptionForm': product.description === item }"
      >
        <label class="magaca">{{ index + 1 }}</label>
        <p class="text">{{ item }}</p>
        <button>
          <label class="icon active" v-if="product.description === item">
            <svg id="icon-checkmark" viewBox="0 0 32 32">
              <path
                d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM13.52 23.383l-7.362-7.363 2.828-2.828 4.533 4.535 9.617-9.617 2.828 2.828-12.444 12.445z"
              ></path>
            </svg>
          </label>

          <label class="icon" v-else>
            <svg id="icon-checkmark" viewBox="0 0 32 32">
              <path
                d="M10 4.008c3.311 0 6 2.699 6 6.016 0 1.895-0.863 3.637-2.373 4.773-2.258 1.707-3.17 3.594-3.484 5.18h-0.286c-0.313-1.586-1.228-3.473-3.484-5.18-1.508-1.137-2.375-2.879-2.375-4.773 0-3.317 2.691-6.016 6.002-6.016M10 0c-5.523 0-10 4.488-10 10.023 0 3.282 1.545 6.149 3.969 7.977 1.115 0.844 2.035 1.93 2.035 3.43v2.555h7.994v-2.555c0-1.5 0.92-2.586 2.033-3.43 2.426-1.828 3.969-4.695 3.969-7.977 0-5.535-4.477-10.023-10-10.023v0zM6 28h8v4h-8z"
              ></path>
            </svg>
          </label>
        </button>
      </div>

      <button class="continue" @click="emit('toggle-next-stage')"> Continue ...</button>
    </div>
  </div>
</template>
