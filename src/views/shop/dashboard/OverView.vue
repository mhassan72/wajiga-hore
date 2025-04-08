<template>
  <div class="page">
    <PageHeader v-if="shop && shop.name" :title="shop.name" />
    <TabsNavShop />

    <div class="description">
      {{ shop.description }}
    </div>

    <ul class="tags">
      <li  v-for="(tag, index) in shop?.metadata?.tags" :key="index" class="tag">
        {{ tag }}
      </li>
    </ul>

    <br>

    <div class="overview">
      <p class="label">Warbixin Guud</p>
      <ul>

        <li>
          <h3>{{ products.length }}</h3>
          <strong>Alaab</strong> 
        </li>

        <li>
          <h3>{{ products.length }}</h3>
          <strong>Dalab</strong> 
        </li>

        <li>
          <h3>{{ "$" + products.length + ".00"}}</h3>
          <strong>Dakhli</strong> 
        </li>

      </ul>
    </div>

    <br>
    <br>

    
    <!-- {{ products.length }} -->
      <div class="products">

        <div class="product" v-if="products.length > 0" v-for="(item, index) in products" :key="index">
          <router-link :to="`prev/${item.uid}`">

            <img :src="item.data.images[0]" alt="Product Image" />
            {{ index+1}} - {{ item.data.name }}
            <ul>
              <li >
                {{ item.data.category }}
              </li>
            </ul>

            <h3>{{ "$" + item.data.price }}</h3>

          </router-link>
        </div>
    
        <div v-else>
          <h5>No Products listed</h5>
        </div>

      </div>


    <!-- Show loading or error if no shop data -->
    <div v-if="loading">
      <p>Loading shop data...</p>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PageHeader from "@/components/mobile/PageHeader.vue";
import { useRoute } from "vue-router";
import FirestoreService from "@/services/FirestoreService";
import TabsNavShop from "@/components/mobile/TabsNavShop.vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/services/firebase.ts'

import '@/assets/styles/views/shop/overview.scss'

// Define a ref to hold the shop data (initializing with an empty object for better template handling)
const shop = ref<any>({});
const route = useRoute();
const products = ref<any>([])
const loading = ref(false)

// Create a FirestoreService instance for the 'shops' collection
const firestoreService = new FirestoreService("shops");
const userId = route.params.userId as string;
const shopId = route.params.shopId as string;


// Fetch shop data from Firestore
async function getShop() {
  try {
    // Fetch the shop record based on shopId
    const shopData = await firestoreService.get(shopId);
    // If shop exists, assign the data to the 'shop' ref
    if (shopData) {
      shop.value = { id: shopId, ...shopData };
      await getProducts()
    } else {
      console.error("Shop not found");
    }
  } catch (error) {
    console.error("Error fetching shop:", error);
  }
}

async function getProducts () {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef, 
      where("shopId", "==", `${shopId}`), 
      where("userId", "==", `${userId}`)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      products.value.push({ uid: doc.id, data: doc.data()});
    })

  } catch (error) {
    console.log(error)
  }

}

// Auto-fetch shop data when the component is mounted
onMounted(() => {
  loading.value = true
  getShop().finally(() => {
    loading.value = false
  })
});
</script>
