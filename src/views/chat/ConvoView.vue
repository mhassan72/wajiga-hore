<template>
  <div class="chat">
    <PageHeader :chat="true" />

    <div class="context">
      <MessageRenderer
        v-for="message in conversations"
        :key="message.id"
        :message="message"
        :isCurrentUser="currentUser.uid === message.senderId"
        :msg_count="conversations?.messages?.length"
        :sellerId="chat?.context?.sellerId"
      />
    </div>

    <ChatBar
      @send="handleSendMessage"
      :chatId="chatId"
      :sellerId="chat?.context?.sellerId"
      :amount="chat?.context?.product?.price"
      :currency="chat?.context?.product?.currency"
    />
  </div>
</template>
<script setup lang="ts">
import PageHeader from "@/components/mobile/PageHeader.vue";
import { auth, dbRt } from "@/services/firebase";
import {
  ref as dbRef,
  onValue,
  get,
  update,
  type DataSnapshot,
} from "firebase/database";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import MessageRenderer from "@/components/chat/MessageRenderer.vue";
import { defineAsyncComponent } from "vue";
import "@/assets/styles/views/chats/chat.scss";

const ChatBar = defineAsyncComponent(
  () => import("@/components/chat/ChatBar.vue")
);

// Types
type Message = {
  id?: number;
  senderId: string;
  text: string;
  type: string;
  timestamp: number;
};

type Chat = {
  chatId: string;
  participants: string[];
  [key: string]: any;
};

const route = useRoute();
const chatId = ref(route.params.chatId as string); // Make reactive!
const currentUser = auth.currentUser!;
const conversations = ref<Message[]>([]);
const chat = ref<Chat | null>(null);

// Fetch messages
const fetchMessages = () => {
  const messagesRef = dbRef(dbRt, `chats/${chatId.value}/messages`);
  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    conversations.value = messages ? Object.values(messages) : [];
  });
};

// Add message(s) to the chat
const addMessagesToChat = async (
  chatId: string,
  newMessages: Omit<Message, "id">[]
) => {
  const messagesRef = dbRef(dbRt, `chats/${chatId}/messages`);
  try {
    const snapshot = await get(messagesRef);
    const existingMessages = snapshot.val() || {};
    const currentCount = Object.keys(existingMessages).length;

    const updates: Record<string, Message> = {};
    newMessages.forEach((msg, index) => {
      const newId = currentCount + index + 1;
      updates[newId] = { id: newId, ...msg };
    });

    await update(messagesRef, updates);
  } catch (error) {
    console.error("❌ Failed to add messages:", error);
  }
};

const handleSendMessage = async (message: Omit<Message, "id">) => {
  await addMessagesToChat(chatId.value, [message]);
};

// Fetch chat metadata
const fetchChatSnapshot = async (
  chatId: string
): Promise<DataSnapshot | null> => {
  try {
    const chatRef = dbRef(dbRt, `chats/${chatId}`);
    const snapshot = await get(chatRef);
    return snapshot.exists() ? snapshot : null;
  } catch (error) {
    console.error("Error fetching chat:", error);
    return null;
  }
};

const updateMessagesToDelivered = async (
  chatId: string,
  chatSnapshot: DataSnapshot
) => {
  try {
    const messages = chatSnapshot.child("messages"); // Correct key
    if (!messages.exists()) {
      console.warn("⚠️ No messages found for chat:", chatId);
      return;
    }

    // Ensure currentUser is valid before proceeding
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("⚠️ Current user is not authenticated");
      return;
    }

    const updates: Record<string, any> = {};
    messages.forEach((childSnapshot) => {
      const messageId = childSnapshot.key;
      const messageData = childSnapshot.val();
      const senderId = messageData.senderId; // Assuming senderId is in the message data

      // Only update messages where the senderId is not the currentUser.uid
      if (messageId && senderId !== currentUser.uid) {
        updates[`chats/${chatId}/messages/${messageId}/status`] = "delivered";
        updates[`chats/${chatId}/messages/${messageId}/seen`] = true; // Mark as seen
      }
    });

    // Perform the update
    await update(dbRef(dbRt), updates);
    console.log(
      "✅ All messages updated to delivered and marked as seen where applicable"
    );
  } catch (error) {
    console.error("❌ Failed to update messages:", error);
  }
};

// React to changes in chatId
watch(
  chatId,
  async (id) => {
    if (!id) {
      console.warn("⚠️ chatId is missing");
      return;
    }

    const chatSnapshot = await fetchChatSnapshot(id);
    if (!chatSnapshot) {
      console.warn("📭 No chat found for ID:", id);
      return;
    }

    await updateMessagesToDelivered(id, chatSnapshot);

    chat.value = {
      chatId: id,
      ...(chatSnapshot.val() as Omit<Chat, "chatId">),
    };

    fetchMessages();
  },
  { immediate: true }
);
</script>
