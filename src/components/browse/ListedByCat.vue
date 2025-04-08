<template>
    <div class="listByCat animate__animated animate__fadeInUp">
        Products Listed by categories

        <!-- {{ products }} -->
        
        
        <div>
            <div v-for="product in products" :key="product.id">
                <router-link :to="`/product/${product.uid}`">
                    <p><strong>{{ product.name }}</strong> - {{ product.category }}</p>
                    <p>Price: ${{ product.price }} - Stock: {{ product.stock }}</p>
                    <p v-if="product.attributes">
                        Attributes:
                        <span v-for="attr in product.attributes" :key="attr.key">
                            {{ attr.key }}: {{ attr.value }} |
                        </span>
                    </p>
                    <hr>
                </router-link>
            </div>

            <button @click="fetchProducts" :disabled="isLoading">Load More</button>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { products, fetchProducts, isLoading } from "@/composables/useProducts";

onMounted(() => {
    fetchProducts(); // Load first batch
});
</script>