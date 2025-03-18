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
                <textarea id="description" v-model="shop.description" placeholder="Enter shop description"
                    required></textarea>
            </div>

            <div class="form-group">
                <div class="input-field-group">
                    <label for="category">Category</label>
                    <select id="category" v-model="shop.category" required>
                        <option value="" disabled selected>Select shop category (e.g., electronics, fashion)</option>
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

        <button type="button" @click="handleSubmit" class="submit-button">Create Shop</button>
    </div>

    <div v-if="error" class="error-message">
        <p>{{ error }}</p>
    </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import '@/assets/styles/views/shop/new.scss'

// Define the shop schema interface
interface Shop {
    name: string;
    owner: string;
    description: string;
    category: string;
    metadata: {
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    };
}

// Define the form data
const shop = ref<Shop>({
    name: "",
    owner: "",
    description: "",
    category: "",
    metadata: {
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
});

// Temporary state for tag input
const tagsInput = ref("");
const error = ref<string | null>(null);

// Handle adding tags to the tags list
const addTag = () => {
    if (tagsInput.value.trim() !== "") {
        shop.value.metadata.tags.push(tagsInput.value.trim());
        tagsInput.value = "";
    }
};

// Handle removing tags from the tags list
const removeTag = (index: number) => {
    shop.value.metadata.tags.splice(index, 1);
};

// Handle form submission
const handleSubmit = () => {
    if (!shop.value.name || !shop.value.owner || !shop.value.description || !shop.value.category) {
        error.value = "Please fill out all required fields.";
        return;
    }

    // Simulate API call to create the shop
    try {
        const newShop = {
            ...shop.value,
            metadata: { ...shop.value.metadata, createdAt: new Date(), updatedAt: new Date() },
        };
        console.log("New Shop Created:", newShop);
        error.value = null; // Clear any previous errors
        // Simulate successful form submission (API call can be done here)
    } catch (err) {
        error.value = "Something went wrong while creating the shop. Please try again.";
    }
};
</script>