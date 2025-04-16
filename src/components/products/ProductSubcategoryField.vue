<script setup lang="ts">
const props = defineProps<{
  product: { subcategory: string };
  stages: { aiSelections: { subcategory: boolean } };
  suggetions: { subcategory: string[] };
}>();

const emit = defineEmits(["update-product-subcategory", "toggle-next-stage"]);
</script>

<template>
  <div class="field" v-if="stages.aiSelections.subcategory">
    <label for="product_subcategory">Subcategory</label>
    <select
      id="product_subcategory"
      v-model="product.subcategory"
      @change="emit('update-product-subcategory', product.subcategory)"
    >
      <option disabled value="">Select a Subcategory...</option>
      <option
        v-for="(item, index) in suggetions.subcategory"
        :key="index"
        :value="item"
      >
        {{ item }}
      </option>
    </select>

    <button class="continue" @click="emit('toggle-next-stage')">
      Sii wad...
    </button>
  </div>
</template>
