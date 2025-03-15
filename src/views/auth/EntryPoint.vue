<template>
    <div class="animate__animated animate__fadeInUp">
        <nav>
            <router-link to="/auth/login">Login</router-link> |
            <router-link to="/auth/register">Register</router-link> 
        </nav>
        <router-view></router-view>
    </div>
</template>
<script lang="ts" setup>
// validate  the current user using firebase auth
// if user is signed in redirect to root else redirect to '/auth/login'
</script>