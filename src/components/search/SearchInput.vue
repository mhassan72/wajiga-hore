<template>
    <div class="search_input">
        <input type="search" class="searchBar" placeholder="Waa Maxay sheyga aad radineyso ...">

        <button>
            <Icon icon="image" />
        </button>
        
        <button v-if="loading">
            <Icon icon="spinner" />
        </button>

        <button class="clean" v-if="close">
            <Icon icon="close" />
        </button>

        <button>
            <Icon icon="search" />
        </button>

    </div>
</template>
<script lang="ts" setup>
import Icon from '@/components/icons/search/Icon.vue'
import '@/assets/styles/components/SearchInput.scss'

const props = defineProps<{
    loading: boolean;
    close: boolean;
}>();

</script>