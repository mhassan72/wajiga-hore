<template>
  <div class="container">
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
        <button
          v-if="!search.isLoading && search.query.length < 1"
          @click="captureAndUploadFromCamera"
        >
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
        <button
          class="clean"
          v-if="search.query.length > 0 && !search.isLoading"
          @click="clearSearch"
        >
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
  </div>
</template>

<script lang="ts" setup>
import Icon from "@/components/icons/search/Icon.vue";
import "@/assets/styles/components/SearchInput.scss";
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios, { AxiosRequestConfig } from "axios";
import { search } from "@/store/search"; // Ensure it's reactive
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/services/firebase";

const searchRef = ref(null);
const isSticky = ref(false);
const isLoading = ref(false);
const API_BASE_URL = "https://us-central1-suuqio.cloudfunctions.net/api";

const imageAnalysis = ref<any>(null);
const imagedownloadLink = ref<any>(null);

const handleScroll = () => {
  if (!searchRef.value) return;
  const offsetTop = searchRef.value.offsetTop + 100;
  isSticky.value = window.scrollY > offsetTop;
};

// Upload image to Firebase and return the download URL
async function uploadImageToFirebase(file: File): Promise<string> {
  search.isLoading = true;

  const filePath = `imagesearch/${Date.now()}_${file.name}`;
  const imageRef = storageRef(storage, filePath);

  const snapshot = await uploadBytes(imageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  imagedownloadLink.value = downloadUrl;
  return downloadUrl;
}

// Trigger camera input, upload the selected image, and handle the result
async function convertImageToJpeg(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Failed to get canvas context");

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("JPEG conversion failed");
          },
          "image/jpeg",
          0.9 // quality
        );
      };

      img.onerror = reject;
      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function captureAndUploadFromCamera(): Promise<void> {
  search.isLoading = true;

  try {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; // Accept all image types
    input.capture = "environment"; // Prefer back camera on mobile

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const jpegBlob = await convertImageToJpeg(file);
          const jpegFile = new File(
            [jpegBlob],
            file.name.replace(/\.\w+$/, ".jpeg"),
            { type: "image/jpeg" }
          );

          await uploadImageToFirebase(jpegFile).then((url) => {
            console.log("JPEG uploaded:", url);
            imageHandler({ imageUrl: url });
            search.isLoading = false;
          });
        } catch (e) {
          console.error("Image conversion failed:", e);
          search.isLoading = false;
        }
      }
    };

    input.click();
  } catch (error) {
    console.error("Camera upload failed:", error);
    search.isLoading = false;
  }
}

async function imageHandler({ imageUrl }: { imageUrl: string }): Promise<any> {
  search.isLoading = true;
  try {
    if (!imageUrl) {
      console.error("No image URL provided");
      return;
    }

    // Send the image URL for analysis
    const options = {
      method: "POST",
      url: `${API_BASE_URL}/image_analysis`,
      headers: { "Content-Type": "application/json" },
      data: { imageUrl },
    };

    const response = await axios.request(options);
    imageAnalysis.value = response.data;

    // Ensure search_term exists in the response before performing the search
    if (imageAnalysis.value?.search_term) {
      search.query = `${imageAnalysis.value?.search_term}`;
      performSearch();
    } else {
      console.error("No search term found in image analysis.");
    }

    search.isLoading = false;

    return response.data; // return data if needed
  } catch (error) {
    console.error("Error fetching image analysis:", error);
    search.isLoading = false;

    return null;
  }
}

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
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
