<template>
  <section class="fav-list-view">
    <h1 class="title">Alaabta aad cashaqday!</h1>
    <br />
    <br />

    <ul v-if="favorites.length">
      <li
        v-for="product in favorites"
        :key="product.id"
        class="product-card"
        @touchstart="startTouch($event, product.id)"
        @touchmove="moveTouch($event, product.id)"
        @touchend="endTouch(product.id)"
        :class="{ swiped: swipedProductId === product.id }"
        @click="goToProduct(product.id)"
      >
        <img
          :src="product.images?.[0]"
          alt="Sawirka Alaabta"
          class="product-image"
        />
        <div class="product-info">
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-price">{{ formatPrice(product.price) }}</p>
        </div>
        <button
          class="remove-button"
          @click.stop="removeFromFavorites(product.id)"
        >
          <svg
            id="icon-trash"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M6 2l2-2h4l2 2h4v2h-16v-2h4zM3 6h14l-1 14h-12l-1-14zM8 8v10h1v-10h-1zM11 8v10h1v-10h-1z"
            ></path>
          </svg>
        </button>
      </li>
    </ul>
    <p v-else>Wali ma aadan dooran wax alaab ah.</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFav } from "@/composables/useFav";

const favorites = ref([]);
const touchStartX = ref(0);
const swipedProductId = ref<string | null>(null);
const router = useRouter();
const { getUserFavoriteIds, getProductsByIds, removeProductFromFavorite } =
  useFav();

onMounted(async () => {
  const favoriteIds = await getUserFavoriteIds();
  favorites.value = await getProductsByIds(favoriteIds);
});

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

async function removeFromFavorites(productId: string) {
  await removeProductFromFavorite(productId);
  favorites.value = favorites.value.filter((p) => p.id !== productId);
  if (swipedProductId.value === productId) swipedProductId.value = null;
}

function goToProduct(productId: string) {
  router.push(`/product/${productId}`);
}

function startTouch(event: TouchEvent, id: string) {
  touchStartX.value = event.touches[0].clientX;
  swipedProductId.value = null;
}

function moveTouch(event: TouchEvent, id: string) {
  const touch = event.touches[0];
  const diff = touchStartX.value - touch.clientX;
  if (diff > 60) {
    swipedProductId.value = id;
  } else if (diff < -60) {
    swipedProductId.value = null;
  }
}

function endTouch(id: string) {
  // Optional: Reset swipe on touch end if needed
}
</script>

<style scoped>
.fav-list-view {
  padding: 1rem;
}

.title {
  font-weight: 300;
  font-size: 1.2rem;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: inherit;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.product-card.swiped {
  transform: translateX(-6rem);
}

.product-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.product-price {
  font-size: 0.875rem;
}

.remove-button {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6rem;
  background: var(--background-color);
  color: inherit;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
