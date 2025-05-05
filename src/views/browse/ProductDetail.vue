<template>
  <div class="page-custom">
    <PageHeader
      :product="route.params.productId"
      :key="route.params.productId"
    />

    <ProductTabs
      v-if="isMounted && product"
      :price="product.price"
      :currency="product.currency"
      :stock="product.stock"
      :productId="product.id"
      :sellerId="product.userId"
      :productName="product.name"
      :images="product.images"
    />

    <ImageSlider :images="product.images" v-if="product?.images.length > 0" />

    <div class="details">
      <h3>{{ product.name }}</h3>

      <p>
        <span class="category">{{ product.category }}</span> ,
        <span class="brand">{{ product.subcategory }}</span>
        <span class="brand">{{ product.subcategory }}</span>
      </p>

      <p>{{ product.description }}</p>

      <div class="returnPolicy" v-if="product.sellerInfo?.returnPolicy">
        Waxaad Kusoo cilinkar taa <br />
        {{ product.sellerInfo?.returnPolicy }}
      </div>
    </div>

    <RelatedProducts
      :vectors="product.embeddings"
      @product-click="handleProductClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from "vue";
import { db, analytics } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "@/components/mobile/PageHeader.vue";
import ProductTabs from "@/components/mobile/ProductTabs.vue";
import ImageSlider from "@/components/shop/ImageSlider.vue";
import RelatedProducts from "@/components/browse/RelatedProducts.vue";
import { logEvent } from "firebase/analytics";
const route = useRoute();
const router = useRouter();

const product = reactive<any>({
  name: "",
  description: "",
  category: "",
  subcategory: "",
  price: 0,
  currency: "USD",
  stock: 0,
  images: [],
  sellerId: "",
  userId: "",
  returnPolicy: "",
  embeddings: [],
  sellerInfo: {},
});

const isMounted = ref(false);

function fetchProductDetails() {
  const productId = route.params.productId;
  const productRef = doc(db, "products", productId.toString());

  return getDoc(productRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        Object.assign(product, docSnap.data());
        isMounted.value = true;
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });
}

function handleProductClick(id: number) {
  router
    .push({ name: "product", params: { productId: id.toString() } })
    .then(() => {
      Object.assign(product, {
        name: "",
        description: "",
        category: "",
        subcategory: "",
        price: 0,
        currency: "USD",
        stock: 0,
        images: [],
        sellerId: "",
        userId: "",
        returnPolicy: "",
        embeddings: [],
        sellerInfo: {},
      });
      isMounted.value = false;
      fetchProductDetails();
    })
    .catch((err) => {
      console.error("Navigation error:", err);
    });
}

watch(
  () => route.params.productId,
  (newId) => {
    if (newId) {
      isMounted.value = false;
      fetchProductDetails().finally(() => {
        document.title = product.name;

        logEvent(analytics, "view_product", {
          product_id: product.id,
          product_name: product.name,
        });
      });
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchProductDetails().finally(() => {
    document.title = product.name;

    logEvent(analytics, "view_product", {
      product_id: product.id,
      product_name: product.name,
    });
  });
});
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
