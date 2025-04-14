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

        <!-- Uploads in progress -->
        <li
          v-for="(progress, fileName) in uploadProgress"
          :key="fileName"
          class="uploading"
        >
          <div class="progress-label">{{ fileName }}</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </li>
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

      <button class="continue" @click="emit('toggle-next-stage')"> Continue ...</button>

    </div>
  </template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storage } from '@/services/firebase'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  images: {
    type: Array as () => string[],
    default: () => []
  }
})

const emit = defineEmits(['update:images', 'toggle-next-stage'])

const fileInput = ref<HTMLInputElement | null>(null)
const localImages = ref<string[]>([...props.images])
const uploadProgress = ref<Record<string, number>>({}) // File name to % progress

watch(
  () => props.images,
  (newImages) => {
    localImages.value = [...newImages]
  }
)

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  const files = Array.from(target.files)
  const uploadedUrls: string[] = []

  for (const file of files) {
    const storagePath = `productImages/${route.params.userId}/${Date.now()}-${file.name}`
    const fileRef = storageRef(storage, storagePath)
    const uploadTask = uploadBytesResumable(fileRef, file)

    // Track progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        uploadProgress.value[file.name] = Math.round(progress)
      },
      (error) => {
        console.error('Upload failed:', error)
        delete uploadProgress.value[file.name]
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        uploadedUrls.push(downloadURL)
        delete uploadProgress.value[file.name]

        // Once finished, update localImages and emit
        if (uploadedUrls.length === files.length) {
          localImages.value.push(...uploadedUrls)
          emit('update:images', localImages.value)
        }
      }
    )
  }

  fileInput.value!.value = ''
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

  .uploading {
    width: 88px;
    height: 88px;
    background-color: #eee;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5rem;
    font-size: 0.7rem;
    text-align: center;
  
    .progress-bar {
      height: 6px;
      background: #ccc;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 0.25rem;
  
      .progress-fill {
        height: 100%;
        background-color: var(--primary-color);
        transition: width 0.2s ease;
      }
    }
  }
  </style>
  