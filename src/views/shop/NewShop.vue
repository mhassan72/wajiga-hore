<template>
    <div class="shop-form">
        <h2>New Store</h2>

        <div class="form-container">
            <div class="form-group">
                <div class="input-field-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" v-model="shop.name" placeholder="Enter shop name" required />
                </div>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="shop.description" placeholder="Enter shop description" required></textarea>
            </div>

            <div class="form-group">
                <div class="input-field-group">
                    <label for="category">Category</label>
                    <select id="category" v-model="shop.category" required>
                        <option value="" disabled selected>Select shop category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="food">Food</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="tags">Tags</label>
                <div class="input-field-group">
                    <input type="text" id="tags" v-model="tagsInput" placeholder="Enter tags separated by commas" />
                    <button type="button" @click="addTag">+</button>
                </div>

                <div class="tags">
                    <span v-for="(tag, index) in shop.metadata.tags" :key="index" class="tag">
                        {{ tag }}
                        <button type="button" @click.prevent="removeTag(index)">x</button>
                    </span>
                </div>
            </div>

            <button type="button" @click="handleSubmit()" class="submit-button">Create Shop</button>
        </div>

        <div v-if="error" class="error-message">
            <p>{{ error }}</p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import "@/assets/styles/views/shop/new.scss";
import FirestoreService from "@/services/FirestoreService";
import { auth } from "@/services/firebase";
import {  onAuthStateChanged } from "firebase/auth";
import type { Shop } from "@/types/shop";

import { profile } from "@/store/user/profile";

// Firestore instance
const database = new FirestoreService<Shop>("shops");

// Form data
const shop = ref({
    name: "",
    owner: profile.value.id,
    description: "",
    category: "",
    metadata: {
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
});

// User state
const currentUserUid = ref<string | null>(null);
const tagsInput = ref("");
const error = ref<string | null>(null);

// ✅ Ensure we get the authenticated user's UID when the component loads
onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        currentUserUid.value = user ? user.uid : null;
    });
});

// Add tags
const addTag = () => {
    const tag = tagsInput.value.trim();
    if (tag && !shop.value.metadata?.tags.includes(tag)) {
        shop.value.metadata?.tags.push(tag);
        tagsInput.value = "";
    }
};

// Remove tags
const removeTag = (index: number) => {
    shop.value.metadata?.tags.splice(index, 1);
};

// Handle form submission
const handleSubmit = async () => {
    error.value = null; // Clear previous errors

    // Check if required fields are filled and trimmed
    // if (!shop.value.name.trim() || !shop.value.description.trim() || !shop.value.category.trim()) {
    //     error.value = "Please fill out all required fields.";
    //     return;
    // }

    if (!currentUserUid.value && !profile.value.id) {
        error.value = "You must be logged in to create a shop.";
        return;
    }


    try {
        // Generate a unique ID for the shop
        const shopId = crypto.randomUUID(); // Generate a random unique ID

        // Store in Firestore
        await database.set(shopId, shop.value);

        console.log("Shop has been created!", shop.value);
        resetAll();
    } catch (err) {
        error.value = "Something went wrong while creating the shop. Please try again.";
    }
};

// Reset form
const resetAll = () => {
    shop.value = {
        name: "",
        owner: "",
        description: "",
        category: "",
        metadata: {
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    };
};
</script>
