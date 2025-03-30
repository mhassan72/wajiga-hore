<template>
    <div class="welcome">

        <p>
            {{ message }},
        </p>

        <h1>
            {{ displayName }} 
        </h1>
        
    </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    message: string;
    displayName: string;
}>();
</script>

<style lang="scss" scoped>
.welcome {
    margin-bottom: 20px;
    margin-left: 20px;
    
    h1 {
        font-weight: 300;
        padding: 0;
        margin: 0;
    }  

    p {
        padding: 0;
        margin: 0;
        margin-bottom: 6px;
    }
}  
</style>