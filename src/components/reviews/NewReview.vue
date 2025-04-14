<template>
  <div class="new_review">
    <div class="context" v-if="state.show">
      <input type="number" name="rating" id="" />
      <textarea name="review" id="review"></textarea>
      <button class="btn">Submit</button>
      <button class="btn" @click="toggleState">Cancel</button>
    </div>
    <button v-if="!state.show" @click="toggleState">Write a review</button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const state = reactive({
  show: false,
});

function toggleState() {
  state.show = !state.show;
}
</script>

<style lang="scss" scoped>
.new_review {
  width: 90%;
  margin: 0 auto;
  overflow-y: break;

  input,
  textarea {
    width: 95%;
  }
}
</style>
