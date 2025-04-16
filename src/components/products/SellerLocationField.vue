<script setup lang="ts">
import { locations } from "@/store/locations";
const props = defineProps<{
  product: { sellerInfo: { location: string } };
  stages: { aiSelections: { location: boolean } };
}>();

const emit = defineEmits(["toggle-next-stage"]);
</script>

<template>
  <section v-if="stages.aiSelections.location">
    <div class="field">
      <label for="seller_location">Goobta Iibiyaha</label>
      <select id="seller_location" v-model="props.product.sellerInfo.location">
        <option disabled value="">Fadlan dooro degmo</option>
        <optgroup
          v-for="region in locations"
          :key="region.gobalka"
          :label="region.gobalka"
        >
          <option
            v-for="district in region.degmada"
            :key="district"
            :value="`${region.gobalka},${district}`"
          >
            {{ district }}
          </option>
        </optgroup>
      </select>
    </div>
    <button class="continue" @click="emit('toggle-next-stage')">
      Sii wad ...
    </button>
  </section>
</template>
