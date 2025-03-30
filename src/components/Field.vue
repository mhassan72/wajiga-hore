<template>
    <div class="field">
      <label :for="id" class="field-label">{{ label }}</label>
      <div class="field-input">
        <!-- Default input field -->
        <slot name="input">
          <input
            v-if="!isSelect"
            :id="id"
            :value="modelValue"
            :type="type"
            :placeholder="placeholder"
            :class="{ 'is-invalid': isInvalid }"
            @input="updateModelValue($event.target.value)"
          />
          <!-- Select field -->
          <select
            v-if="isSelect"
            :id="id"
            :value="modelValue"
            :class="{ 'is-invalid': isInvalid }"
            @change="updateModelValue($event.target.value)"
          >
            <slot name="options"></slot>
          </select>
        </slot>
      </div>
  
      <!-- Validation error message -->
      <span v-if="isInvalid" class="field-error">{{ errorMessage }}</span>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, computed } from 'vue';
  
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const isSelect = computed(() => {
    return props.type === 'select';
  });
  
  const updateModelValue = (value: string | number) => {
    emit('update:modelValue', value);
  };
  </script>
  
  <style scoped>
  .field {
    margin-bottom: 1rem;
  }
  
  .field-label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .field-input {
    display: flex;
    flex-direction: column;
  }
  
  input,
  select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  input.is-invalid,
  select.is-invalid {
    border-color: red;
  }
  
  .field-error {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  </style>
  