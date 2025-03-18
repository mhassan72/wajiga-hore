<template>
    <div class="shop animate__animated animate__fadeIn">
        <PageHeader title="My Shop" />
        <!-- Hide this if shop.length > 0 -->
        <div class="container" v-if="!shops.value || !Object.keys(shops.value).length">
            <div class="callToAction">
                <h3>Call To Action!</h3>
                <p>Here is where you sell the product to potential shop or sole trader.</p>
                <router-link to="/shop/new">new</router-link>
            </div>
        </div>

        <!-- else show this  -->
        <div class="container" v-if="shops.value && Object.keys(shops.value).length">
            <div class="list">
                <p>List all the shops where the current user is the owner</p>
                <ul v-if="shops.value && Object.keys(shops.value).length">
                    <li v-for="(shop, id) in shops.value" :key="id">{{ shop.name }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import PageHeader from '@/components/mobile/PageHeader.vue';
import '@/assets/styles/views/shop/main.scss';
import { db } from '@/services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { shops } from '@/store/shop/index'; // Importing shop store ref

// Function to fetch shop data from Firestore
const fetchShops = async () => {
    try {
        const userShopsQuery = query(collection(db, 'shops'), where('ownerId', '==', 'CURRENT_USER_ID')); 
        const querySnapshot = await getDocs(userShopsQuery);
        shops.value = Object.fromEntries(querySnapshot.docs.map(doc => [doc.id, doc.data()]));
    } catch (error) {
        console.error('Error fetching shops:', error);
    }
};

// Auto-fetch data when the component is mounted
onMounted(fetchShops);
</script>
