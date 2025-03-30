<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  product: { attributes: { key: string; type: string; value: string }[] };
  stages: { aiSelections: { subcategory: boolean } };
}>();

const emit = defineEmits(['add-attribute', 'remove-attribute', 'toggle-next-stage']);
</script>

<template>
  <section v-if="stages.aiSelections.attributes">
    <div class="field">
      <label>Attributes</label>
      <div
        v-for="(attr, index) in props.product.attributes"
        :key="index"
        class="attribute-field"
      >
        <input type="text" v-model="attr.key" placeholder="Attribute Key" />
        <select v-model="attr.type">
          <option value="string">Xaraf</option>
          <option value="number">Tiro</option>
        </select>
        <input
          :type="attr.type === 'number' ? 'number' : 'text'"
          v-model="attr.value"
          :placeholder="`Attribute Value (${attr.type})`"
        />
        <button @click="emit('remove-attribute', index)">Remove</button>
      </div>
      <button @click="emit('add-attribute')">Add Attribute</button>
    </div>
    <button class="continue" @click="emit('toggle-next-stage')">Continue ...</button>
  </section>
</template>
