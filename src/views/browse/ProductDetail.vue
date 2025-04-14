<template>
    <div class="page-custom">
        <PageHeader />
        <ProductTabs :price="product.price " :currency="product.currency" />

        <ImageSlider :images="product.images"  v-if="product?.images.length > 0" />


        <div class="details">
            <h3>{{ product.name }}</h3>
            
            <p>
                <span class="stock"> Stock: {{ product.stock }}</span> , 
                <span class="category"> Category: {{ product.category }}</span> , 
                <span class="brand"> Subcategory: {{ product.subcategory }}</span>   
            </p>

            <p>
                {{ product.description }}
            </p>

            <div class="returnPolicy" v-if="product.returnPolicy">
                Return Policy: {{  product.returnPolicy }}
            </div>

        </div>
        
        <!-- {{ product }} -->
    </div>

</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { db } from '@/services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/mobile/PageHeader.vue';
import ProductTabs from '@/components/mobile/ProductTabs.vue'   
import ImageSlider from '@/components/shop/ImageSlider.vue'

import '@/assets/styles/views/browse/ProductDetail.scss'


const product = reactive<Products>({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    currency: 'USD',
    stock: 0,
    images: [],
    sellerId: '',
    returnPolicy: ''
})

interface Products {
    name: string
    description: string
    category: string
    subcategory: string
    price: number
    currency: string
    stock: number
    images: string[]
    sellerId: string
    returnPolicy?: string
}

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

onMounted(() => {
    fetchProductDetails()
})
</script>
<style lang="scss" scoped>
.page-custom {
    margin-top: 70px;
}

</style>