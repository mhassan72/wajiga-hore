<template>
    <h1>
        Protectedroute {{ uid }}
    </h1>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const uid = route.params.uid
</script>