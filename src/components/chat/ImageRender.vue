<template>
  <div v-if="message.type === 'images'" class="images">
    <!-- Thumbnail Images -->
    <img
      v-for="(url, index) in imageUrls"
      :key="index"
      class="imagePrev"
      :src="url"
      :alt="`Image ${index + 1}`"
      @click="openModal(index)"
    />

    <!-- Modal for image view -->
    <div v-if="isModalOpen" class="modal" @click.self="closeModal">
      <div
        class="modal-content"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <button class="close-btn" @click="closeModal">&times;</button>
        <img
          :src="currentImageUrl"
          :alt="'Image ' + (currentImageIndex + 1)"
          class="modal-image"
        />
        <div class="modal-nav">
          <button v-if="currentImageIndex > 0" @click="prevImage">‹</button>
          <button
            v-if="currentImageIndex < imageUrls.length - 1"
            @click="nextImage"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type { Message } from "@/composables/useChat";

// Props
const props = defineProps<{ message: Message }>();

// Modal state
const isModalOpen = ref(false);
const currentImageIndex = ref(0);

// Get imageUrls from the message content
const imageUrls = computed(
  () => (props.message.content as { imageUrls: string[] }).imageUrls
);

// Swipe state
let startX = 0;
let endX = 0;

// Open modal with the clicked image
const openModal = (index: number) => {
  currentImageIndex.value = index;
  isModalOpen.value = true;
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Go to previous image
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// Go to next image
const nextImage = () => {
  if (currentImageIndex.value < imageUrls.value.length - 1) {
    currentImageIndex.value++;
  }
};

// Get current image URL
const currentImageUrl = computed(
  () => imageUrls.value[currentImageIndex.value]
);

// Handle touch start event
const handleTouchStart = (event: TouchEvent) => {
  startX = event.touches[0].clientX;
};

// Handle touch move event (optional for smooth swipe)
const handleTouchMove = (event: TouchEvent) => {
  endX = event.touches[0].clientX;
};

// Handle touch end event (detect swipe)
const handleTouchEnd = () => {
  const swipeDistance = startX - endX;
  if (swipeDistance > 50) {
    nextImage(); // Swipe left to go to the next image
  } else if (swipeDistance < -50) {
    prevImage(); // Swipe right to go to the previous image
  }
};
</script>

<style scoped>
.images {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Increased gap for larger images */
  justify-content: right;
}

.imagePrev {
  width: 150px; /* Increased image size */
  height: 150px;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.imagePrev:hover {
  opacity: 0.7;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: var(--background-color);
  padding: 20px;
  max-width: 100vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.modal-image {
  width: 100%;
  height: auto; /* Ensures full size image without distortion */
  object-fit: contain; /* Keeps aspect ratio intact */
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
}

.modal-nav {
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.modal-nav button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
}

.modal-nav button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

@media (max-width: 600px) {
  .imagePrev {
    width: 120px; /* Adjusted for mobile */
    height: 120px;
  }

  .modal-content {
    max-width: 95%;
    max-height: 90%;
  }
}

@media (max-width: 400px) {
  .imagePrev {
    width: 100px; /* Further reduced on very small screens */
    height: 100px;
  }

  .modal-content {
    max-width: 100%;
    max-height: 90%;
  }

  .modal-image {
    max-height: 70vh; /* Ensure the image doesn't overflow */
  }
}
</style>
