<template>
  <div class="chat">
    <!-- Chat Header -->
    <div class="chat_header">
      <BackBtn />
      <div class="user">Conversations</div>
      <button class="options">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path
            d="M10.001 7.8c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2c1.215 0 2.199-0.985 2.199-2.2s-0.984-2.2-2.199-2.2zM3.001 7.8c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2c1.215 0 2.199-0.986 2.199-2.2s-0.984-2.2-2.199-2.2zM17.001 7.8c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2c1.215 0 2.199-0.985 2.199-2.2s-0.984-2.2-2.199-2.2z"
          ></path>
        </svg>
      </button>
    </div>

    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      >
      <div class="loading_wrapper" v-if="loading">
        <br>
        Loading ...
      </div>
    </transition>

    <transition
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut"
    >

    <div class="list_container" v-if="!loading">
      <ul class="convo_list">
        <li class="convo" v-for="chat in chats" :key="chat.chatId">
          <router-link :to="`/chat/${chat.chatId}`">
            <div
              class="convo_image"
              :style="{
                'background-image': `url(${
                  chat.product?.media?.images[0] || 'default-image.jpg'
                })`,
              }"
            ></div>
            <div class="convo_context">
              <h5 class="convo_name">{{ chat.product?.title || "Unknown Product" }}</h5>
              <p class="convo_last">{{ chat.lastMessageText || "No messages yet" }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

  </transition>


  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, auth } from "@/services/firebase";
import BackBtn from "@/components/mobile/BackBtn.vue";

import "@/assets/styles/views/chats/chat_list.scss";

// Define chat interface
interface Chat {
  id: string;
  chatId: string;
  shopId: string;
  lastMessageText?: string;
  product?: {
    title?: string;
    media?: {
      images: string[];
    };
  };
}

// Reactive state
const chats = ref<Chat[]>([]);
const loading = ref(true);

// Fetch chats for the authenticated user
const fetchChats = async () => {
  try {
    loading.value = true;
    const user = auth.currentUser;
    if (!user) return console.warn("⚠️ User not authenticated");

    const chatsCollection = collection(db, "chats");
    const chatsQuery = query(chatsCollection, where("userId", "==", user.uid));

    const chatDocs = await getDocs(chatsQuery);
    chats.value = chatDocs.docs.map((doc) => ({
      chatId: doc.id,
      ...doc.data(),
    })) as Chat[];
  } catch (error) {
    console.warn("⚠️ Error fetching chats:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch chats on mount
onMounted(fetchChats);
</script>
