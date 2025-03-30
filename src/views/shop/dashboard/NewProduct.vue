<template>
  <div class="page">
    <PageHeader title="New Product" />
    <!-- {{ stSuggest }} -->
    <div class="new-product">
      
      <ProductNameField 
        :product="product" 
        :stSuggest="stSuggest" 
        :stages="stages" 
        :suggetions="suggetions"
        @fetch-suggestions="fetchsuggestions"
        @update-product-name="(name) => product.name = name"
        @toggle-next-stage="toggleNextStage"
      />




      <ProductDescriptionField
        :product="product"
        :stSuggest="stSuggest"
        :stages="stages"
        :suggetions="suggetions"
        @update-product-description="(desc) => product.description = desc"
        @toggle-next-stage="toggleNextStage"
      />


      <ProductCategoryField
        :product="product"
        :stages="stages"
        :suggetions="suggetions"
        @update-product-category="(category) => product.category = category"
        @toggle-next-stage="toggleNextStage"
      />


      <ProductSubcategoryField
        :product="product"
        :stages="stages"
        :suggetions="suggetions"
        @update-product-subcategory="(subcategory) => product.subcategory = subcategory"
        @toggle-next-stage="toggleNextStage"
      />



      <ProductPricingField
        :product="product"
        :stages="stages"
        @update-product-price="(price) => product.price = price"
        @update-product-currency="(currency) => product.currency = currency"
        @toggle-next-stage="toggleNextStage"
      />




      <ProductStockField
        :product="product"
        :stages="stages"
        @update-product-stock="(stock) => product.stock = stock"
        @toggle-next-stage="toggleNextStage"
      />


      <ProductStatusField
        :product="product"
        :stages="stages"
        @update-product-status="(status) => product.status = status"
        @toggle-next-stage="toggleNextStage"
      />


      <ProductAttributesField
        :product="product"
        :stages="stages"
        @add-attribute="addAttribute"
        @remove-attribute="removeAttribute"
        @toggle-next-stage="toggleNextStage"
      />



      <SellerLocationField
        :product="product"
        :stages="stages"
        @toggle-next-stage="toggleNextStage"
      />



      <SellerReturnPolicyField
        :product="product"
        :stages="stages"
        @toggle-next-stage="toggleNextStage"
      />


    <!-- Submit Button -->
    <div class="field" v-if="stages.aiSelections.save_product">
      <button @click="handleSubmit" :disabled="isLoading">
        {{ isLoading ? "Saving..." : "Save Product" }}
      </button>
    </div>


    </div>


    <div class="loading-wrapper" v-if="stages.loading">
      <div class="loading">
        <span class="loading__dot"></span>
        <span class="loading__dot"></span>
        <span class="loading__dot"></span>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PageHeader from "@/components/mobile/PageHeader.vue";
import { PRODUCT_CATEGORIES } from "@/store/shop/categories"; // Import your categories
import type { Product, ProductStatus, Attribute } from "@/types/product"; // Ensure this type is defined
import axios from 'axios'
import { db,  auth } from '@/services/firebase'
import { doc, collection, setDoc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router'



import '@/assets/styles/views/products/new.scss'

// import components
import ProductNameField from '@/components/products/ProductNameField.vue'
import ProductDescriptionField  from '@/components/products/ProductDescriptionField.vue'
import ProductCategoryField  from '@/components/products/ProductCategoryField.vue'
import ProductSubcategoryField  from '@/components/products/ProductSubcategoryField.vue'
import ProductPricingField  from '@/components/products/ProductPricingField.vue'
import ProductStockField  from '@/components/products/ProductStockField.vue'
import ProductStatusField from '@/components/products/ProductStatusField.vue'
import ProductAttributesField from '@/components/products/ProductAttributesField.vue'
import SellerLocationField from '@/components/products/SellerLocationField.vue'
import SellerReturnPolicyField from '@/components/products/SellerReturnPolicyField'

// set route and router
const route = useRoute()
const router = useRouter()

// Use the product ref from the service (or define it locally if needed)
const product = ref<Product>({
  name: "",
  description: "",
  category: "Uncategorized",
  subcategory: "",
  price: 0,
  currency: "USD",
  stock: 0,
  images: [],
  sellerId: "",
  userId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  status: "active",
  attributes: [],
  metadata: {
    views: 0,
    clicks: 0,
    favorites: 0,
  },
  sellerInfo: {
    rating: 0,
    location: "",
    returnPolicy: "NONE",
  },
});

const suggetions = ref({})
const stSuggest = ref({
  count: 0,
  loading: false,
})

interface AiSelections {
  name: boolean;
  description: boolean;
  category: boolean; // Fixed typo from "cattegory" to "category"
  subcategory: boolean;
  pricing: boolean;
  stock: boolean;
  status: boolean;
  attributes: boolean;
  location: boolean;
  seller_return_policy: boolean
  save_product: boolean
}

interface Stages {
  loading: boolean;
  aiSelections: AiSelections;
}

const stages = ref<Stages>({
  loading: false,
  aiSelections: {
    name: false,
    description: false,
    category: false,
    subcategory: false,
    pricing: false,
    stock: false,
    status: false,
    attributes: false,
    location: false,
    seller_return_policy: false,
    save_product: false
  }
});

function toggleNextStage() {
  // Get all keys from aiSelections
  const stageKeys = Object.keys(stages.value.aiSelections) as Array<keyof AiSelections>;

  // Find the current active stage (true value)
  const currentActiveIndex = stageKeys.findIndex(key => stages.value.aiSelections[key]);

  // Determine the next index to activate
  let nextIndex: number;

  if (currentActiveIndex === -1) {
    // If none are active, start with the first one
    nextIndex = 0;
  } else {
    // Turn off the current active stage
    stages.value.aiSelections[stageKeys[currentActiveIndex]] = false;

    // Move to the next stage
    nextIndex = currentActiveIndex + 1;
  }

  // Activate the next stage
  stages.value.aiSelections[stageKeys[nextIndex]] = true;

  // Check if all stages are completed and update 'save_product' if necessary
  const allStagesCompleted = Object.values(stages.value.aiSelections).every(stage => stage === true);

  if (allStagesCompleted) {
    stages.value.aiSelections.save_product = true;
  }
}

const isLoading = ref(false);

async function fetchsuggestions() {
  stSuggest.value.count = stSuggest.value.count + 1
  stSuggest.value.loading = true
  stages.value.loading = true
  const options = {
    method: 'POST',
    url: 'https://us-central1-suuqio.cloudfunctions.net/api/productFieldSuggestionFlow',
    headers: { 'Content-Type': 'application/json' },
    data: { productName: `${product.value.name}` }
  };

  await axios.request(options)
    .then(function (response) {
      suggetions.value = response.data
      stages.value.aiSelections.name = true
    }).catch(function (error) {
      suggetions.value = {}
    }).finally(() => {
      stSuggest.value.loading = false
      stages.value.loading = false
    })
}

// Handle form submission
const handleSubmit = async () => {
  try {

    // Get the currently authenticated user
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to save a product.");
      return;
    }

    // Assign userId to the product before saving
    product.value.userId = user.uid;
    product.value.shopId = route.params.shopId
    // Create a new document reference in the "products" collection
    const newProductRef = doc(collection(db, "products"));

    // Add the product data
    await setDoc(newProductRef, product.value);

    // If successful, notify the user
    alert("Product saved successfully!");

    // redirect to tthe product view
    router.push(`/shop/${route.params.userId}/dashboard/${route.params.shopId}/prev/${newProductRef.id}`);

  } catch (error) {
    console.error("Error creating product:", error);

    // Display a user-friendly error message
    alert("Failed to create product. Please try again later.");
  }
};

// Reset the form
const resetForm = () => {
  product.value = {
    name: "",
    description: "",
    category: "Uncategorized",
    subcategory: "",
    price: 0,
    currency: "USD",
    stock: 0,
    images: [],
    sellerId: "",
    userId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
    attributes: [],
    metadata: {
      views: 0,
      clicks: 0,
      favorites: 0,
    },
    sellerInfo: {
      rating: 0,
      location: "",
      returnPolicy: "NONE",
    },
  };
};

// Add a new attribute
const addAttribute = () => {
  product.value.attributes.push({ key: "", type: "string", value: null });
};

// Remove an attribute
const removeAttribute = (index: number) => {
  product.value.attributes.splice(index, 1);
};
</script>
