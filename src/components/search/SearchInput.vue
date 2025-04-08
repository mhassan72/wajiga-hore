<template>
    <div class="search_input">
      <input
        type="search"
        class="searchBar"
        v-model="search.query"
        placeholder="Waa Maxay sheyga aad radineyso ..."
        @keydown.enter="performSearch"
      />
  
      <transition
        enter-active-class="animate__animated animate__fadeInRight"
        leave-active-class="animate__animated animate__fadeOutRight"
      >
        <button v-if="!search.isLoading && search.query.length < 1">
          <Icon icon="image" />
        </button>
      </transition>
  
      <transition
        enter-active-class="animate__animated animate__fadeInRight"
        leave-active-class="animate__animated animate__fadeOutRight"
      >
        <button v-if="search.isLoading" class="loading">
          <Icon icon="spinner" class="spinner" />
        </button>
      </transition>
  
      <transition
        enter-active-class="animate__animated animate__fadeInRight"
        leave-active-class="animate__animated animate__fadeOutRight"
      >
        <button class="clean" v-if="search.query.length > 0 && !search.isLoading" @click="clearSearch">
          <Icon icon="close" />
        </button>
      </transition>
  
      <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <button @click="performSearch" v-if="!search.isLoading">
          <Icon icon="search" />
        </button>
      </transition>
    </div>
  </template>
  

<script lang="ts" setup>
import Icon from "@/components/icons/search/Icon.vue";
import "@/assets/styles/components/SearchInput.scss";
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios, { AxiosRequestConfig } from "axios";
import { search } from "@/store/search"; // Ensure it's reactive


const searchRef = ref(null)
const isSticky = ref(false)

const handleScroll = () => {
  if (!searchRef.value) return
  const offsetTop = searchRef.value.offsetTop  + 100
  isSticky.value = window.scrollY > offsetTop
}


// Reactive state
const isLoading = ref(false);
const API_BASE_URL = "https://us-central1-suuqio.cloudfunctions.net/api";

// Perform search function
async function performSearch(): Promise<void> {
    if (!search.query || search.query.trim() === "") {
        console.error("Search term is empty");
        search.error = "Search term cannot be empty";
        return;
    }

    try {
        search.isLoading = true;
        console.log("Sending search request with term:", search.query);

        const requestConfig: AxiosRequestConfig = {
            method: "POST",
            url: `${API_BASE_URL}/search`,
            headers: { "Content-Type": "application/json" },
            data: { term: search.query.trim() }, // Ensure trimmed and valid input
        };

        const response = await axios.request(requestConfig);
        search.results = response.data;

        console.log("Search results:", response.data);
    } catch (error: any) {
        console.error("API request failed:", error.response?.data || error.message);
        search.value.error = error.response?.data || "Something went wrong";
    } finally {
        search.isLoading = false; // Ensure loading state is reset
    }
}

// Clear search function
function clearSearch() {
    search.query = "";
    search.results = [];
}


onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
