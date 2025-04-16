<script setup lang="ts">
const props = defineProps<{
  product: { sellerInfo: { returnPolicy: string } };
  stages: { aiSelections: { seller_return_policy: boolean } };
}>();

const emit = defineEmits(["toggle-next-stage"]);

// Xulashooyinka heshiiska soo celinta
const returnPolicyOptions = [
  "Ma jirto heshiis soo celin",
  "Soo celin 3 maalmood gudahood",
  "Soo celin 7 maalmood gudahood",
  "Soo celin 14 maalmood gudahood",
  "Soo celin 30 maalmood gudahood",
  "Soo celin 60 maalmood gudahood",
  "Heshiis gaar ah",
];
</script>

<template>
  <section v-if="stages.aiSelections.seller_return_policy">
    <div class="field">
      <label for="seller_return_policy">Heshiiska Soo Celinta Alaabta</label>
      <select
        id="seller_return_policy"
        v-model="props.product.sellerInfo.returnPolicy"
      >
        <option value="" disabled selected>
          Fadlan dooro muddada aad rabto inaad soo celiso alaabta
        </option>
        <option
          v-for="option in returnPolicyOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <small class="help-text"> Tusaale: Soo celin 14 maalmood gudahood </small>
    </div>
    <br />
    <button class="continue" @click="emit('toggle-next-stage')">
      Sii wad...
    </button>
  </section>
</template>

<style scoped>
.help-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}
</style>
