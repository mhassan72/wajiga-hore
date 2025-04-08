<template>
    <div class="page">
        <PageHeader :title="product.name" />

        <AddImages @update:images="productImages = $event" :images="product.images" />
        
        <!-- {{ product }} -->
    </div>

</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { db } from '@/services/firebase'
import { collection, doc, getDoc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/mobile/PageHeader.vue';
import AddImages from '@/components/shop/AddImages.vue'


const product = reactive({})

function fetchProductDetails() {
    const route = useRoute()
    const productId = route.params.productId

    const productRef = doc(db, 'products', productId)
    getDoc(productRef)
        .then((doc) => {
            if (doc.exists()) {
                Object.assign(product, doc.data())
            } else {
                console.log('No such document!')
            }
        })
        .catch((error) => {
            console.error('Error getting document:', error)
        })
}

function productImages () {
    const images = [
    ]
    return images
}

onMounted(() => {
    fetchProductDetails()
})
</script>