<template>
    <button @click="backBtn" class="btn-clean">
        <IconBack />
    </button>
</template>
<script lang="ts" setup>
import '@/assets/styles/components/BtnBack.scss'
import { useRouter } from 'vue-router';
import IconBack from '@/components/icons/IconBack.vue';
const router = useRouter()

function backBtn () {
    router.go(-1)
}
</script>