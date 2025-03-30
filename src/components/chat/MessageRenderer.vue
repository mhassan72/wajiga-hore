<template>
  <div
    class="text-container"
    :class="{
      user: message.senderId === 'currentUser',
      seller: message.senderId !== 'currentUser',
    }"
  >
    <!-- Text Message -->
    <div v-if="message.type === 'text'" class="text">
      <strong>{{ message.senderId }}</strong
      >:
      <p>{{ message.content }}</p>
    </div>

    <!-- Payment Request -->
    <div v-if="message.type === 'payment-request'" class="payment-request">
      Helloooooo!
    </div>

    <!-- Image Message -->
    <div v-if="message.type === 'image'" class="image">
      <img
        class="imagePrev"
        :src="(message.content as Context).imageUrl"
        :alt="(message.content as Context).caption"
      />
      <!-- <div class="text">{{ (message.content as Context).caption }}</div> -->
    </div>

    <!-- Order Confirmation -->
    <div v-if="message.type === 'order-confirmation'" class="order-confirmation">
      {{ message.content }}
    </div>

    <!-- Audio Recording -->
    <div v-if="message.type === 'audioFile'" class="audio">
      <audio controls>
        <source :src="(message.content as Context).audioFile?.mp3" type="audio/mpeg" />
        <source :src="(message.content as Context).audioFile?.ogg" type="audio/ogg" />
        <source :src="(message.content as Context).audioFile?.webm" type="audio/webm" />
        Your browser does not support the audio element.
      </audio>
    </div>

    <!-- Default for Unsupported Types -->
    <div
      v-if="
        !['text', 'payment-request', 'image', 'order-confirmation', 'audioFile'].includes(
          message.type
        )
      "
    >
      Unsupported message type: {{ message.content }}
      {{ message }}
    </div>

    <!-- Seen Status and Timestamp -->
    <div class="seen">
      <small>{{ message.seen ? "seen" : "unseen" }}</small>
    </div>
    <span class="time">{{ formatTimestamp(message.timestamp) }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Message, Context } from "@/composables/useChat";

defineProps<{ message: Message }>();

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

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
