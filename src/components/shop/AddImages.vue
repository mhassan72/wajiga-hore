<template>
    <div class="images-container">
      <h2>Sawirada Badeecada</h2>
      <p>Halkani uga dar sawirada.</p>
  
      <ul class="imageList">
        <!-- Upload Trigger -->
        <li class="imagePlaceholder" @click="triggerFileInput">+</li>
  
        <!-- Render Uploaded Images -->
        <li
          class="image"
          v-for="(image, index) in localImages"
          :key="index"
          :style="{ backgroundImage: `url(${image})` }"
        ></li>
      </ul>
  
      <!-- Hidden File Input -->
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleFileChange"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    images: {
      type: Array as () => string[],
      default: () => []
    }
  })
  
  const emit = defineEmits(['update:images'])
  
  const fileInput = ref<HTMLInputElement | null>(null)
  const localImages = ref<string[]>([...props.images])
  
  watch(
    () => props.images,
    (newImages) => {
      localImages.value = [...newImages]
    }
  )
  
  function triggerFileInput() {
    fileInput.value?.click()
  }
  
  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (!target.files) return
  
    const files = Array.from(target.files)
    const readers = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    })
  
    Promise.all(readers).then((newImageUrls) => {
      localImages.value.push(...newImageUrls)
      emit('update:images', localImages.value)
    })
  }
  </script>
  
  <style lang="scss" scoped>
  .images-container {
    padding: 1rem;
  
    h2 {
      font-size: 1.2rem;
      margin-bottom: 0.25rem;
    }
  
    p {
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }
  
    .imageList {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
  
      .imagePlaceholder,
      .image {
        width: 88px;
        height: 88px;
        border-radius: 0;
        background-color: var(--faded-color);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        color: var(--primary-color);
        background-size: cover;
        background-position: center;
        cursor: pointer;
      }
  
      .imagePlaceholder {
        border: 2px dashed var(--primary-color);
      }
    }
  }
  </style>
  