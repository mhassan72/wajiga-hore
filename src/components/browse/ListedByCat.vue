<template>
    <div class="listByCat animate__animated animate__fadeInUp">
        <h2>Products Listed by Categories</h2>

        <div v-for="[category, productList] in Object.entries(productsByCategory)" :key="category" class="category-group">
            <h3>{{ category }}</h3>
            
            <div v-for="product in productList" :key="product.id" class="product-item">
                <router-link :to="`/product/${product.uid}`">
                    <p><strong>{{ product.name }}</strong></p>
                    <p>Price: ${{ product.price }} - Stock: {{ product.stock }}</p>
                    <p v-if="product.attributes">
                        Attributes:
                        <span v-for="attr in product.attributes" :key="attr.key">
                            {{ attr.key }}: {{ attr.value }} |
                        </span>
                    </p>
                </router-link>
                <hr>
            </div>
        </div>

        <button @click="fetchProducts" :disabled="isLoading">Load More</button>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { products, fetchProducts, isLoading } from "@/composables/useProducts";

// Group products by category
const productsByCategory = computed(() => {
    const grouped: Record<string, typeof products.value> = {};
    products.value.forEach(product => {
        const category = product.category || 'Uncategorized';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(product);
    });
    return grouped;
});

onMounted(() => {
    fetchProducts(); // Load first batch
});
</script>
