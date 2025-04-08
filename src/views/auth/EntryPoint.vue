<template>
    <div class="animate__animated animate__fadeInUp">
        <router-view :key="new Date()" ></router-view>
    </div>
</template>
<script lang="ts" setup>
// validate  the current user using firebase auth
// if user is signed in redirect to root else do nothing
</script>