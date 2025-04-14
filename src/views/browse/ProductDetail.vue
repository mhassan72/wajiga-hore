<template>
  <div class="page-custom">
    <PageHeader />
    <ProductTabs
      :price="product.price"
      :currency="product.currency"
      :stock="product.stock"
    />

    <ImageSlider :images="product.images" v-if="product?.images.length > 0" />

    <div class="details">
      <h3>{{ product.name }}</h3>

      <p>
        <span class="stock"> Stock: {{ product.stock }}</span> ,
        <span class="category"> Category: {{ product.category }}</span> ,
        <span class="brand"> Subcategory: {{ product.subcategory }}</span>
      </p>

      <p>
        {{ product.description }}
      </p>

      <div class="returnPolicy" v-if="product.returnPolicy">
        Return Policy: {{ product.returnPolicy }}
      </div>
    </div>

    <RelatedProducts
      :vectors="product.embeddings"
      @product-click="handleProductClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "@/components/mobile/PageHeader.vue";
import ProductTabs from "@/components/mobile/ProductTabs.vue";
import ImageSlider from "@/components/shop/ImageSlider.vue";
import RelatedProducts from "@/components/browse/RelatedProducts.vue";

const route = useRoute();
const router = useRouter();

const product = reactive({
  name: "",
  description: "",
  category: "",
  subcategory: "",
  price: 0,
  currency: "USD",
  stock: 0,
  images: [],
  sellerId: "",
  returnPolicy: "",
  embeddings: [],
});

function fetchProductDetails() {
  const productId = route.params.productId;
  const productRef = doc(db, "products", productId.toString());

  getDoc(productRef)
    .then((doc) => {
      if (doc.exists()) {
        Object.assign(product, doc.data());
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });
}

function handleProductClick(id: number) {
  // Force component to reload by pushing to the same route with different ID
  router
    .push({ name: "product", params: { productId: id.toString() } })
    .then(() => {
      // Reset product data before fetching new one
      Object.assign(product, {
        name: "",
        description: "",
        // ... other default values
      });
      fetchProductDetails();
    })
    .catch((err) => {
      console.error("Navigation error:", err);
    });
}

// Watch for route changes
watch(
  () => route.params.productId,
  (newId) => {
    if (newId) {
      fetchProductDetails();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.page-custom {
  margin-top: 70px;
  margin-bottom: 150px;

  .details {
    margin: 0 auto;
    padding: 20px;
  }
}
</style>
