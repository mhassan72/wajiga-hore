<template>
    <nav class="tabs">
      <div class="price">
        <span v-if="currency === 'USD'">$</span>
        <span v-else-if="currency === 'EUR'">€</span>
        <span v-else-if="currency === 'GBP'">£</span>
        <span v-else>{{ currency }}</span>
        {{ price }}
      </div>
      <button class="contact-btn">IIBSO</button>
    </nav>
  </template>
  
  <script lang="ts" setup>
  defineProps<{
    price?: number
    currency?: string
  }>()
  </script>