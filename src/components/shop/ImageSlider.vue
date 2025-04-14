<template>
  <div class="slider" ref="slider">
    <div
      class="slides"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        class="slide"
        v-for="(image, index) in images"
        :key="index"
      >
        <img :src="image" alt="Slide image" loading="lazy" />
        <button class="open-modal-btn" @click="openModal(index)">🔍 View</button>
      </div>
    </div>

    <button class="nav prev" @click="prevSlide">&#8592;</button>
    <button class="nav next" @click="nextSlide">&#8594;</button>

    <div class="dots">
      <span
        v-for="(image, index) in images"
        :key="index"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      />
    </div>
  </div>

  <!-- Modal -->
  <div class="modal" v-if="showModal" @click.self="closeModal">
    <div class="modal-content">
      <button class="close" @click="closeModal">×</button>
      <div
        class="slides"
        :style="{ transform: `translateX(-${modalIndex * 100}%)` }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="slide" v-for="(image, index) in images" :key="index">
          <img :src="image" alt="Slide in modal" loading="lazy" />
        </div>
      </div>
      <button class="nav prev" @click="prevModalSlide">&#8592;</button>
      <button class="nav next" @click="nextModalSlide">&#8594;</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const currentIndex = ref(0)
const showModal = ref(false)
const modalIndex = ref(0)

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}
const goToSlide = (index: number) => {
  currentIndex.value = index
}

const openModal = (index: number) => {
  modalIndex.value = index
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

// Modal navigation
const nextModalSlide = () => {
  modalIndex.value = (modalIndex.value + 1) % props.images.length
}
const prevModalSlide = () => {
  modalIndex.value = (modalIndex.value - 1 + props.images.length) % props.images.length
}

// Touch gestures
let startX = 0
let endX = 0

const onTouchStart = (e: TouchEvent) => {
  startX = e.touches[0].clientX
}
const onTouchMove = (e: TouchEvent) => {
  endX = e.touches[0].clientX
}
const onTouchEnd = () => {
  const distance = endX - startX
  if (distance > 50) prevModalSlide()
  else if (distance < -50) nextModalSlide()
}

// Escape key to close modal
const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal()
}
onMounted(() => window.addEventListener('keydown', handleKey))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))
</script>


<style lang="scss" scoped>
.slider {
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
}

.slides {
  display: flex;
  transition: transform 0.4s ease;
}

.slide {
  flex: 0 0 100%;
  position: relative;

  img {
    width: 100%;
    max-height: 400px;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    background-color: #f4f4f4; // optional: fills space around images
  }

  .open-modal-btn {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border: none;
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 4px;
    cursor: pointer;
    z-index: 2;
  }
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: none;
  padding: 0.6rem;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 2;

  &.prev {
    left: 0.5rem;
  }

  &.next {
    right: 0.5rem;
  }
}

.dots {
  text-align: center;
  margin-top: 0.5rem;

  .dot {
    width: 10px;
    height: 10px;
    margin: 0 3px;
    background-color: #ccc;
    border-radius: 50%;
    display: inline-block;
    cursor: pointer;

    &.active {
      background-color: #000;
    }
  }
}



/* Modal styles */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal-content {
    position: relative;
    width: 100%;
    max-width: 90%; /* Limit width of the modal */
    max-height: 90vh; /* Limit height of the modal */
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    border-radius: 8px;
  }

  .slides {
    display: flex;
    transition: transform 0.4s ease-in-out;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .slide {
    flex: 0 0 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 100%;
    overflow: hidden;
    margin-right: 10px; /* Add a gap between images */
  }

  .slide:last-child {
    margin-right: 0; /* Remove margin from the last image */
  }

  .slide img {
    max-height: 100vh;
    max-width: 100%;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    font-size: 2rem;
    padding: 1rem;
    cursor: pointer;
    z-index: 10;

    &.prev {
      left: 1rem;
    }

    &.next {
      right: 1rem;
    }
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2.5rem;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
  }
}



/* Enhancements for larger screens */
@media (min-width: 768px) {
  .slider {
    max-width: 600px;
    margin: 0 auto;
  }

  .nav {
    padding: 1rem;
    font-size: 1.75rem;
  }

  .slide .open-modal-btn {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }

  .modal-content {
    max-width: 800px;
  }
}

</style>
