<template>
  <div
    class="text-container"
    :class="{
      user: isCurrentUser,
      seller: !isCurrentUser,
    }"
  >
    <!-- Text Message -->
    <div v-if="message.type === 'text'" class="text">
      <strong>{{ isCurrentUser ? "Adiga" : message.senderId }}</strong>
      <p>{{ message.text }}</p>
    </div>

    <!-- Payment Request -->
    <div v-if="message.type === 'payment-request'" class="payment-confirmation">
      <div class="card">
        <div class="header">
          <span class="emoji">💸</span>
          <span class="title">Kafiirso</span>
        </div>

        <div class="amount">
          {{ message.content.amount }} {{ message.content.currency }}
        </div>

        <div class="meta">
          <div class="row">
            <span class="label">Bixiyaha:</span>
            <span>{{ message.content.payment_method.provider }}</span>
          </div>
          <div class="row">
            <span class="label">Akoonka:</span>
            <span>
              {{ message.content.payment_method.accountType.number }}
            </span>
          </div>
          <div class="row status" :class="message.status.toLowerCase()">
            <span class="label">Xaaladda Dalabka : </span>
            <span>{{ message.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Message -->
    <ImageRender :message="message" :isCurrentUser="isCurrentUser" />

    <!-- Order Confirmation -->
    <div
      v-if="message.type === 'order-confirmation'"
      class="order-confirmation"
    >
      {{ message.content }}
    </div>

    <!-- Audio Recording -->
    <div v-if="message.type === 'audioFile'" class="audio">
      <audio controls>
        <source
          :src="(message.content as Context).audioFile?.mp3"
          type="audio/mpeg"
        />
        <source
          :src="(message.content as Context).audioFile?.ogg"
          type="audio/ogg"
        />
        <source
          :src="(message.content as Context).audioFile?.webm"
          type="audio/webm"
        />
        Your browser does not support the audio element.
      </audio>
    </div>

    <!-- Default for Unsupported Types -->
    <div
      v-if="
        ![
          'text',
          'payment-request',
          'images',
          'order-confirmation',
          'audioFile',
        ].includes(message.type)
      "
    >
      Unsupported message type: {{ message.content }}
      {{ message }}
    </div>

    <!-- Seen Status and Timestamp -->
    <div class="state">
      <span class="time">{{ formatTimestamp(message.timestamp) }}</span>

      <div class="seen">
        <svg
          id="icon-check"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M9 16.172l10.594-10.594 1.406 1.406-12 12-5.578-5.578 1.406-1.406z"
          ></path>
          <path
            d="M9 16.172l10.594-10.594 1.406 1.406-12 12-5.578-5.578 1.406-1.406z"
          ></path>
        </svg>
        <!-- <small>{{ message.seen ? "Waa la arkay!" : "Lama arkin" }}</small> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, Context } from "@/composables/useChat";
import "@/assets/styles/views/chats/messages.scss";

import { defineAsyncComponent } from "vue";
const ImageRender = defineAsyncComponent(
  () => import("@/components/chat/ImageRender.vue")
);

defineProps<{ message: Message; isCurrentUser: boolean }>();

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    return date.toLocaleString();
  }
};
</script>
