<template>
  <div class="related_products" :key="productId">
    <p class="label">Alaabaha La Midka ah</p>

    <div v-if="loading" class="loader">Loading...</div>

    <div v-else-if="products.length > 0">
      <ul class="product_list">
        <li
          v-for="(product, index) in products"
          :key="index"
          @click="handleProductClick(product.id)"
        >
          <div class="product_item">
            <div
              class="image"
              :style="{ backgroundImage: `url(${product.images[0]})` }"
            ></div>

            <div class="details">
              <p class="product_name">{{ product.name }}</p>
              <p class="product_price">
                {{ formatPrice(product.price, product.currency) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="no_products">No related products found.</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import "@/assets/styles/components/related_product.scss";

const props = defineProps<{
  vectors?: any[];
}>();

const route = useRoute();
const router = useRouter();

const emit = defineEmits<{
  (e: "product-click", id: number): void;
}>();

const products = reactive<any[]>([]);
const loading = ref(false);
const productId = computed(() => route.params.productId);

function handleProductClick(id: number) {
  emit("product-click", id);
}
// Format price with currency
function formatPrice(price: number, currency: string = "USD"): string {
  if (price == null) return "N/A";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${price}`;
  }
}

async function fetchRelatedProducts(vectors: any[]) {
  if (!vectors || vectors.length === 0) return;

  loading.value = true;
  try {
    const response = await axios.post(
      "https://us-central1-suuqio.cloudfunctions.net/api/related_products",
      { vectors },
      { headers: { "Content-Type": "application/json" } }
    );

    products.splice(0, products.length, ...response.data);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
  } finally {
    loading.value = false;
  }
}

// Fetch again if the route param changes
watch(
  () => props.vectors,
  (newVectors) => {
    fetchRelatedProducts(newVectors);
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped></style>
