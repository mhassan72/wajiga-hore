<template>
  <div class="field">
    <!-- <label for="product_name" v-if="stSuggest.count < 1">Faah Faahin Ku saabsan sheyga aad doneyso in aad iibiso</label> -->
    <p v-if="stSuggest.count < 1">
      Halkan waxaad ku qoraysaa faahfaahin kooban oo ku saabsan sheyga aad rabto
      inaad iibiso.
    </p>
    <textarea
      type="text"
      id="product_name"
      placeholder="Maxaad iibinaysaa? Faahfaahin yar halkan ku qor ..."
      v-model="product.name"
      v-if="stSuggest.count < 1"
    />
    <button v-if="stSuggest.count < 1" @click="$emit('fetch-suggestions')">
      Hore Usoco
    </button>

    <div
      class="suggestions"
      v-if="stSuggest.count > 0 && stages.aiSelections.name"
    >
      <div class="callToAction">
        <p>Waa tan liiskaaga AI-ga uu sameeyay. Fadlan dooro magac badeecad.</p>
      </div>

      <div
        class="item"
        v-for="(item, index) in suggetions.names"
        :key="index"
        @click="$emit('update-product-name', item)"
        :class="{ selectedOptionForm: product.name === item }"
      >
        <label class="magaca">{{ index + 1 }}</label>
        <p class="text">{{ item }}</p>
        <button>
          <label class="icon active" v-if="product.name === item">
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

      <button class="continue" @click="$emit('toggle-next-stage')">
        Sii wad...
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: Object,
  stSuggest: Object,
  stages: Object,
  suggetions: Object,
});

const emit = defineEmits([
  "fetch-suggestions",
  "update-product-name",
  "toggle-next-stage",
]);
</script>
