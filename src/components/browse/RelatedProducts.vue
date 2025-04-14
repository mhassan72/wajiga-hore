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
            <p class="product_name">{{ product.name }}</p>
            <p class="product_price">
              {{ formatPrice(product.price, product.currency) }}
            </p>
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

<style lang="scss" scoped>
.related_products {
  width: 90%;
  margin: 0 auto;
  padding: 1rem;
  font-family: sans-serif;

  .label {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .loader,
  .no_products {
    text-align: center;
    font-size: 1rem;
    padding: 1rem 0;
  }

  .product_list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    padding: 0;
    margin: 0;
  }

  .product_list li {
    list-style: none;
    flex: 1 1 calc(100% - 2rem); // full width on small screens
    max-width: 100%;
  }

  @media (min-width: 600px) {
    .product_list li {
      flex: 1 1 calc(50% - 1rem);
      max-width: calc(50% - 1rem);
    }
  }

  @media (min-width: 900px) {
    .product_list li {
      flex: 1 1 calc(33.33% - 1rem);
      max-width: calc(33.33% - 1rem);
    }
  }

  .product_item {
    border: 1px solid #ccc;
    padding: 0.75rem;
    border-radius: 0.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .product_name {
    font-weight: bold;
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }

  .product_price {
    font-size: 0.95rem;
    margin-top: auto;
  }
}
</style>
