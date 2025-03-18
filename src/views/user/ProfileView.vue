<template>
    <div class="profile-card animate__animated animate__fadeIn">

        <PageHeader />

        <div class="avatar" :style="{ backgroundImage: `url(${user.avatarUrl})` }">
        </div>
        <div class="profile-info">
            <h2> {{ profile?.data?.displayName }}</h2>
            <p class="role">{{ profile?.data?.role }}</p>

            <p class="description">
                {{ profile.description }}
            </p>
            <div class="buttons">

                <router-link to="/chats" class="btn-primary">
                    Messages
                </router-link>

            </div>
            <div class="stats">
                <div>
                    <strong>{{ user.ordersCount }}</strong>
                    <p>Orders</p>
                </div>
                <div>
                    <strong>{{ user.wishlistCount }}</strong>
                    <p>Wishlist Items</p>
                </div>
                <div>
                    <strong>{{ user.pendingReturns }}</strong>
                    <p>Pending Returns</p>
                </div>
            </div>
            <div class="tabs">
                <router-link to="/" class="btn-primary active"> Orders</router-link>
                <router-link to="/favourite" class="btn-primary"> Favourite</router-link>
                <router-link :to="`/shop/${profile.data.id}`" class="btn-primary"> My Shops</router-link>
            </div>
            <div class="order-card animate__animated animate__fadeInUp">
                <h3>Latest Order: {{ user.latestOrder }}</h3>
                <p>Estimated Delivery: {{ user.estimatedDelivery }}</p>
                <p class="status">Status: {{ user.orderStatus }}</p>
            </div>

        </div>
    </div>
</template>


<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { profile } from '@/store/user/profile'
import PageHeader from '@/components/mobile/PageHeader.vue'

import '@/assets/styles/views/profile/profileDetails.scss'

const route = useRoute()
const uid = route.params.uid

// Example of dynamic data (assuming you have a method to fetch user data)
const user = ref({
    name: 'M Barry',
    role: 'Customer',
    description: 'Shopping enthusiast with a love for exclusive deals',
    avatarUrl: 'https://placehold.co/600x400/EEE/31343C', // Dynamically set the avatar based on uid
    ordersCount: 12,
    wishlistCount: 5,
    pendingReturns: 3,
    latestOrder: 'Nike Air Max',
    estimatedDelivery: '2 Days',
    orderStatus: 'Shipped'
})

</script>