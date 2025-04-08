<template>
    <div class="shop animate__animated animate__fadeIn">
        <PageHeader title="Dukaaman Keyga" />

        <!-- Show this if no shops are available for the current user -->
        <div class="container" v-if="shops.length < 1">
            <div class="callToAction">
                <h3>Call To Action!</h3>
                <p>Here is where you sell the product to potential shop or sole trader.</p>
                <router-link to="/shop/new">Create a new shop</router-link>
            </div>
        </div>

        <!-- Show this if the user has shops -->
        <div class="container" v-else>
            <div class="list">
                <!-- <p>List all the shops where the current user is the owner</p> -->
                <ul>
                    <li v-for="(shop, id) in shops" :key="id"  class="shop-arr">
                        <router-link :to="`/shop/${route.params.userId}/dashboard/${shop.id}/overview`">
                            <div class="shop-comp">
                                
                                <div class="name">
                                    {{ shop.name }}
                                </div>

                                <div class="id">
                                    {{ shop.id }}
                                </div>

                                <!-- <div class="description">
                                    {{ shop.description }}...
                                </div> -->


                                <div class="tags">
                                    <div class="tag" v-for="(tag, index) in shop.metadata.tags">
                                        {{ tag }} 
                                    </div>
                                </div>
                                
                            </div>
                            <div class="avatar">
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import PageHeader from '@/components/mobile/PageHeader.vue';
import '@/assets/styles/views/shop/main.scss';
import { db } from '@/services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRoute } from 'vue-router';

const route = useRoute();
const shops = ref([]); // Ensure shops is an array

// Function to fetch shop data from Firestore
const fetchShops = async () => {
    try {
        const userId = route.params.userId;
        if (!userId) {
            console.error("No user ID found in route params.");
            return;
        }

        const userShopsQuery = query(collection(db, 'shops'), where('owner', '==', userId)); 
        const querySnapshot = await getDocs(userShopsQuery);

        // Map Firestore documents to an array
        shops.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {
        console.error('Error fetching shops:', error);
    }
};

// Auto-fetch data when the component is mounted
onMounted(fetchShops);
</script>
