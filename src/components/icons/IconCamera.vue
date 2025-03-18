<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor">
        <path
          d="M24 19v-11c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-3.465l-1.703-2.555c-0.182-0.27-0.486-0.445-0.832-0.445h-6c-0.326 0.002-0.64 0.158-0.832 0.445l-1.703 2.555h-3.465c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v11c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h18c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121z"
        ></path>
      </svg>
</template>
<script setup lang="ts">
const props = defineProps<{
    width?: number
    height?: number
}>()
</script>