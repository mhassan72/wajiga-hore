<template>
  <transition
    enter-active-class="animate__animated animate__fadeInUp"
    leave-active-class="animate__animated animate__fadeOutDown"
  >
    <div class="wrapper" v-if="visible">
      <div class="pricing">
        <strong>{{ formattedPrice }}</strong>
      </div>

      <div class="quantity">
        <button @click="decrement">-</button>
        <strong>{{ count }}</strong> / {{ stock }}
        <button @click="increment">+</button>
      </div>

      <div class="bg-color" @click="startChat">
        <svg
          id="icon-plus"
          fill="currentColor"
          width="26"
          height="26"
          viewBox="0 0 24 24"
        >
          <path
            d="M22 11.497v-0.497c0-0.017-0.001-0.038-0.002-0.058-0.136-2.338-1.113-4.461-2.642-6.051-1.602-1.667-3.814-2.752-6.301-2.889-0.016-0.001-0.036-0.002-0.055-0.002h-0.489c-1.405-0.016-2.882 0.31-4.264 1.008-1.223 0.621-2.291 1.488-3.139 2.535-1.322 1.634-2.107 3.705-2.108 5.946-0.014 1.275 0.253 2.61 0.824 3.877l-1.772 5.317c-0.066 0.196-0.072 0.418 0 0.632 0.175 0.524 0.741 0.807 1.265 0.632l5.314-1.771c1.16 0.527 2.484 0.826 3.876 0.823 1.372-0.009 2.714-0.308 3.941-0.866 1.912-0.871 3.54-2.373 4.541-4.375 0.644-1.249 1.015-2.715 1.011-4.261zM20 11.503c0.003 1.225-0.292 2.375-0.789 3.339-0.801 1.602-2.082 2.785-3.592 3.472-0.97 0.442-2.035 0.679-3.126 0.686-1.221 0.003-2.371-0.292-3.335-0.789-0.249-0.129-0.528-0.142-0.775-0.060l-3.803 1.268 1.268-3.803c0.088-0.263 0.060-0.537-0.056-0.767-0.552-1.094-0.804-2.254-0.792-3.338 0.001-1.789 0.619-3.42 1.663-4.709 0.671-0.829 1.518-1.517 2.49-2.010 1.092-0.552 2.252-0.804 3.336-0.792h0.456c1.962 0.107 3.704 0.961 4.969 2.277 1.202 1.251 1.972 2.916 2.086 4.753z"
          ></path>
        </svg>
        <span> Iibso </span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { profile } from "@/store/user/profile";
import { computed, ref, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { dbRt, auth } from "@/services/firebase";
import { ref as dbRef, set, push } from "firebase/database";

const router = useRouter();
const route = useRoute();
const visible = ref(true);
const props = defineProps<{
  price?: any;
  currency?: string;
  stock?: number;
  productId?: string;
  productName?: string;
  sellerId?: string;
  images?: any[];
}>();

const { productName } = toRefs(props);

// Get current user and set the buyer/seller info
const buyerId = auth.currentUser?.uid || "";
const sellerId = props.sellerId;
const count = ref(1);

const priceMultiplier = computed(() => props.price * count.value);

// Reactive state inside setup
const chat = reactive({
  messages: [
    {
      id: 1,
      senderId: buyerId,
      type: "text", // text | image | payment_request | order_update | receipt | system
      text: "Asc, Wali ma heli karaa?",
      timestamp: new Date().getTime(),
      status: "delivered",
      senderName: auth.currentUser?.displayName,
    },
  ],
  context: {
    productId: `${route.params.productId}`,
    sellerId: props.sellerId, // could also be buyerId if you want both
    order: {
      orderId: "",
      status: "pending", //  "delivered" | "cancelled" | "completed"
    },
    product: {
      id: `${route.params.productId}`,
      name: props.productName,
      images: props.images,
      price: priceMultiplier,
      currency: props.currency,
      stock: props.stock,
      quantity: count.value,
    },
  },
  participants: [sellerId, buyerId], // optional but helpful
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
});

// Function to start a new chat
const startChat = async () => {
  if (!auth.currentUser) {
    alert("You must be logged in to start a chat!");
    return;
  }

  try {
    // Step 1: Create a new chat reference in Firebase Realtime Database
    const newChatRef = push(dbRef(dbRt, "chats"));

    // Step 2: Set initial data for the chat
    await set(newChatRef, chat);

    // Step 3: Update the chat ID to reference the newly created chat
    const chatId = newChatRef.key || "";

    // Step 4: Update the reactive chat object with the new chat ID
    chat.context.order.orderId = chatId; // Store the chat ID in the order object
    chat.createdAt = Date.now();
    chat.updatedAt = Date.now();

    // Optional: Navigate to the chat screen (e.g., to view the conversation)
    router.push(`/chat/${chatId}`);

    alert("Chat started successfully!");
  } catch (error) {
    console.error("Error starting chat:", error);
    alert("There was an error starting the chat. Please try again.");
  }
};

function increment() {
  if (count.value >= props?.stock) return;
  count.value++;
}

function decrement() {
  if (count.value <= 1) return;
  count.value--;
}

const routeNewProduct = `/sheycusub/${profile.value.id}`;
const formattedPrice = computed(() => {
  if (props.price == null) return "N/A";
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: props.currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Extract numeric part & manually prepend $
    const parts = formatter.formatToParts(
      priceMultiplier ? priceMultiplier.value : props.price
    );
    const amount = parts
      .filter((part) => part.type !== "currency")
      .map((part) => part.value)
      .join("");

    return `$ ${amount}`; // adds space after $
  } catch {
    return `$ ${props.price}`;
  }
});
</script>

<style lang="scss" scoped>
.bg-color {
  background: var(--primary-color);
  border-radius: 50px;
  min-width: 40px;
  height: 40px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-smooth: 100;
  padding-left: 10px;
  padding-right: 10px;
  gap: 6px;
  color: var(--chat-product-text);
  cursor: pointer;
}

button {
  background: none;
  color: white;
  font-size: 1.3rem;
  color: var(--tabs-text-color);
}

.wrapper {
  background: var(--tabs-color);
  position: fixed;
  height: 50px;
  bottom: 2vh;
  left: 2%;
  right: 2%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 50px;
  overflow: hidden;
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 1px 1px 6px 2px rgba(6, 6, 6, 0.08);
  z-index: var(--max-z-index);
  padding-left: 20px;
  padding-right: 10px;
  color: var(--tabs-text-color);
}
</style>
