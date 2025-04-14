<template>
    <div class="listByCat animate__animated animate__fadeInUp">

      <div
        v-for="[category, productList] in Object.entries(productsByCategory)"
        :key="category"
        class="category-group"
      >
        <h3>{{ category }}</h3>
  
        <div class="products-grid">
          <div
            v-for="product in productList"
            :key="product.id"
            class="product-card"
          >
            <router-link :to="`/product/${product.uid}`">
              <div class="image-wrapper" v-if="product.images?.[0]">
                <img :src="product.images[0]" :alt="product.name" />
              </div>
              <div class="product-info">
                <p class="product-title">{{ product.name }}</p>
                <p class="product-price">${{ product.price }}</p>
                <p v-if="product.attributes" class="product-attributes">
                  <span
                    v-for="attr in product.attributes"
                    :key="attr.key"
                    class="attribute"
                  >
                    {{ attr.key }}: {{ attr.value }}
                  </span>
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
  
      <button @click="fetchProducts" :disabled="isLoading">Load More</button>
    </div>
</template>  


<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { products, fetchProducts, isLoading } from "@/composables/useProducts";

const productsByCategory = computed(() => {
  const grouped: Record<string, typeof products.value> = {};
  products.value.forEach((product) => {
    const category = product.category || "Uncategorized";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(product);
  });
  return grouped;
});

onMounted(() => {
  fetchProducts();
});
</script>
<style lang="scss" scoped>
.listByCat {
  padding: 1rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .category-group {
    margin-bottom: 2rem;

    h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: 1fr; // Mobile: single column
      gap: 1rem;

      @media (min-width: 480px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      }

      @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }

    .product-card {
      background: var(--faded-color);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      overflow: hidden;
      transition: box-shadow 0.2s ease;
      text-decoration: none;
      color: inherit;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .image-wrapper {
        width: 100%;
        aspect-ratio: 1 / 1;
        background: #f9f9f9;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .product-info {
        padding: 0.75rem;

        .product-title {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .product-price {
          color: #27ae60;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .product-attributes {
          font-size: 0.75rem;
          color: #666;

          .attribute {
            margin-right: 0.5rem;
          }
        }
      }
    }
  }

  button {
    margin-top: 1.5rem;
    padding: 0.75rem 1.25rem;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;

    &:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
  }
}
</style>
