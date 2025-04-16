<template>
  <div class="profile-card animate__animated animate__fadeIn">
    <PageHeader />

    <div v-if="profile" class="profile-info">
      <div
        class="avatar"
        :style="{ backgroundImage: `url(${profile.avatar || defaultAvatar})` }"
      ></div>
      <h2>{{ profile.displayName || "Magac La'aan" }}</h2>
      <p class="role">{{ profile.role || "Macaamiil" }}</p>

      <p class="description">
        {{ profile.description || "Macluumaad lama helin." }}
      </p>

      <div class="stats">
        <div>
          <strong>{{ products.length }}</strong>
          <p>Alaabta</p>
        </div>
        <div>
          <strong>{{ favorites.length }}</strong>
          <p>Kaheshay</p>
        </div>
      </div>

      <ol>
        <li v-for="(item, index) in products" :key="index" class="product-item">
          <router-link :to="`/product/${item.id}`">
            <div class="images">
              <div
                class="image"
                v-for="img in item.images"
                :style="{ backgroundImage: `url(${img})` }"
              ></div>
            </div>

            <h3>{{ item.name }}</h3>

            {{ item.price }},
            {{ item.description }}
          </router-link>
        </li>
      </ol>
    </div>

    <p v-else>Fadlan sug...</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProfile } from "@/composables/useProfile";
import PageHeader from "@/components/mobile/PageHeader.vue";
import "@/assets/styles/views/profile/profileDetails.scss";
const defaultAvatar = "https://placehold.co/600x400/EEE/31343C";

const route = useRoute();
const uid = route.params.uid as string;

const { profile, userProducts: products, favorites } = useProfile(uid);
</script>
