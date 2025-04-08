<template>
    <div class="page-custom">
        <PageHeader />
        <ProductTabs :price="product.price " :currency="product.currency" />

        <ImageSlider :images="images" />


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
import { collection, doc, getDoc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/mobile/PageHeader.vue';
import ProductTabs from '@/components/mobile/ProductTabs.vue'   
import ImageSlider from '@/components/shop/ImageSlider.vue'

import '@/assets/styles/views/browse/ProductDetail.scss'

const images = [
    'https://cdn.dribbble.com/userupload/8705244/file/original-479b14c79b824778ff3e1b1cf62a96e3.jpg?resize=2400x1800&vertical=center',
    'https://plus.unsplash.com/premium_photo-1661769750859-64b5f1539aa8?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdCUyMGltYWdlfGVufDB8fDB8fHww',
    'https://lezzat.co.uk/wp-content/uploads/2021/03/Amazon-Product-Photography-Agency-UK-1.jpg'
]

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

onMounted(() => {
    fetchProductDetails()
})
</script>
<style lang="scss" scoped>
.page-custom {
    margin-top: 70px;
}

</style>