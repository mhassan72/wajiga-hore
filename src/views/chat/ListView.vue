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
        <br />
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
                    chat.product?.media?.images[0] ||
                    'https://placehold.co/600x400/EEE/31343C'
                  })`,
                }"
              ></div>
              <div class="convo_context">
                <h5 class="convo_name">
                  {{ chat.chatId || "Unknown Product" }}
                </h5>
                <p class="convo_last">
                  {{ chat.order || "No messages yet" }}
                </p>
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
import { getDatabase, ref as rtdRef, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { dbRt, auth } from "@/services/firebase";
import BackBtn from "@/components/mobile/BackBtn.vue";

import "@/assets/styles/views/chats/chat_list.scss";

// Define chat interface
interface Chat {
  context: {
    id: string;
    order: {
      id: string;
      status: string;
    };
  };
  status: string;
  productId: string;
  sellerId: string;
  createdAt: number;
  messages: {
    id: string;
    text: string;
    type: string; // Message type | Order | Order_status | Order_update | video | audio | image | audio | text |
    senderId: string;
    createdAt: number;
  }[];
  participants: {
    id: string;
    name: string;
    avatarUrl: string;
  }[];
}

// Reactive state
const chats = ref<Chat[]>([]);
const loading = ref(true);

// Fetch chats for the authenticated user
const fetchChats = () => {
  try {
    loading.value = true;
    const user = auth.currentUser;
    if (!user) {
      console.warn("⚠️ User not authenticated");
      return;
    }

    const chatsRef = rtdRef(dbRt, `chats`); // Reference to the 'chats' node in RTDB

    onValue(chatsRef, (snapshot) => {
      const chatsData = snapshot.val();

      if (chatsData) {
        // Convert the RTDB data (which is an object) into an array of chats
        chats.value = Object.entries(chatsData).map(([chatId, chatData]) => ({
          chatId: chatId,
          ...(chatData as Omit<Chat, "chatId">), //chat data except chatId
        })) as Chat[];
      } else {
        chats.value = []; // No chats found
      }
    });
  } catch (error) {
    console.warn("⚠️ Error fetching chats:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch chats on mount
onMounted(fetchChats);
</script>
