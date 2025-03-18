<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 32 32">
    <path v-if="success" d="M0 11l2-2 5 5 11-11 2 2-13 13z"></path>
    <path v-if="error" d="M10 8.586l-7.071-7.071-1.414 1.414 7.071 7.071-7.071 7.071 1.414 1.414 7.071-7.071 7.071 7.071 1.414-1.414-7.071-7.071 7.071-7.071-1.414-1.414-7.071 7.071z"></path>
  </svg>
</template>

<script lang="ts" setup>
defineProps<{ 
  success?: boolean; 
  error?: boolean 
  }>();
</script>
