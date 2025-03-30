<template>
<div class="page_rec animate__animated animate__fadeInUp">
    <Welcome message="Salam" :displayName="user.displayName" />

    <section class="search animate__animated animate__fadeInDown">
        <SearchInput />
    </section>

    <br>

    <div class="products_viewed animate__animated animate__fadeInDown">
        Products Viewed sort by date
    </div>

    <div class="convos animate__animated animate__fadeInDown">
        Converstions sort by convo timestamp
    </div>

    <div class="listByCat animate__animated animate__fadeInDown">
        Products Listed by categories
    </div>

</div>
</template>
<script lang="ts" setup>
import { useEmailAuth } from '@/composables/usePhoneAuth';
import SearchInput from '@/components/search/SearchInput.vue'
import Welcome from '@/components/Welcom.vue'
import { ref } from 'vue'

const { user } = useEmailAuth();
const search = ref<any>({
    term: '',
    results: []
})
</script>
