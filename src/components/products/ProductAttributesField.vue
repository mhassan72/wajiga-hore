<script setup lang="ts">
const props = defineProps<{
  product: { attributes: { key: string; type: string; value: string }[] };
  stages: { aiSelections: { subcategory: boolean } };
}>();

const emit = defineEmits([
  "add-attribute",
  "remove-attribute",
  "toggle-next-stage",
]);
</script>

<template>
  <section v-if="stages.aiSelections.attributes">
    <div class="field">
      <label>Sifooyinka</label>
      <div
        v-for="(attr, index) in props.product.attributes"
        :key="index"
        class="attribute-field"
      >
        <input type="text" v-model="attr.key" placeholder="Furaha Sifada" />
        <select v-model="attr.type">
          <option value="string">Xaraf</option>
          <option value="number">Tiro</option>
        </select>
        <input
          :type="attr.type === 'number' ? 'number' : 'text'"
          v-model="attr.value"
          :placeholder="`Qiimaha Sifada (${attr.type})`"
        />
        <button @click="emit('remove-attribute', index)">Ka saar</button>
      </div>
      <button @click="emit('add-attribute')">Ku dar Sifo</button>
    </div>
    <br />
    <br />
    <button class="continue" @click="emit('toggle-next-stage')">
      Sii wad ...
    </button>
  </section>
</template>
