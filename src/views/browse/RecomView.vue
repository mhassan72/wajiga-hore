<template>
    <div class="page_rec animate__animated animate__fadeInUp">
      <Welcome message="Salam" :displayName="user?.displayName ?? ''" />
  
      <!-- Sticky Search -->
      <div ref="searchRef" :class="['search', 'animate__animated', 'animate__fadeInDown', { sticky: isSticky }]">
        <SearchInput />
      </div>
  
      <br />
  
      <!-- Search Results -->
      <transition
        enter-active-class="animate__animated animate__fadeInUp"
        leave-active-class="animate__animated animate__fadeOutDown"
      >
        <div v-if="search.results.length > 0 && search.query" class="products_viewed">
          <div class="search_results">
            <h2>Search Results</h2>
            <ul>
              <li v-for="(result, index) in search.results" :key="index">
                <router-link :to="`/product/${result.id}`">
                  {{ result.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </transition>
  
      <!-- Browse Section -->
      <transition
        enter-active-class="animate__animated animate__fadeInUp"
        leave-active-class="animate__animated animate__fadeOutDown"
      >
        <div v-if="!search.query" class="browse">
          <div class="products_viewed">
            Products Viewed (sorted by date)
          </div>
  
          <div class="convos">
            Conversations (sorted by latest message)
          </div>
  
          <ListedByCat />
        </div>
      </transition>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useEmailAuth } from '@/composables/usePhoneAuth'
  import SearchInput from '@/components/search/SearchInput.vue'
  import Welcome from '@/components/Welcome.vue' // Fixed typo
  import ListedByCat from '@/components/browse/ListedByCat.vue'
  import { search } from '@/store/search'
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const { user } = useEmailAuth()
  
  const searchRef = ref<HTMLElement | null>(null)
  const isSticky = ref(false)
  let searchTop = 0
  
  const handleScroll = () => {
    if (!searchRef.value) return
    isSticky.value = window.scrollY >= searchTop
  }
  
  onMounted(() => {
    if (searchRef.value) {
      searchTop = searchRef.value.offsetTop
    }
    window.addEventListener('scroll', handleScroll)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  </script>
  
  <style scoped>
  .sticky {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: white;
    padding-top: 1rem;
    padding-bottom: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  