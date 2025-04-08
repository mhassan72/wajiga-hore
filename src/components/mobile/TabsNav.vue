<template>
    <transition
            enter-active-class="animate__animated animate__fadeInUp"
            leave-active-class="animate__animated animate__fadeOutDown"
    >
        <div class="wrapper">
            <RouterLink to="/">
                <div>
                    <IconHome />
                </div>
            </RouterLink>
            <RouterLink :to="`/profile/${profile.id}`">
                <div>
                    <IconUser />
                </div>
            </RouterLink>
            <RouterLink to="/search/kfbywef">
                <div>
                    <IconSearch />
                </div>
            </RouterLink>
            <RouterLink to="/favourite">
                <div>
                    <IconSupport />
                </div>
            </RouterLink>
            <RouterLink to="/chats">
                <div>
                    <IconCommunity />
                </div>
            </RouterLink>
        </div>
    </transition>
</template>
<script lang="ts" setup>
    import '@/assets/styles/components/tabs.scss'
    import IconHome from '@/components/icons/IconHome.vue'
    import IconUser from '@/components/icons/IconUser.vue'
    import IconSearch from '@/components/icons/IconSearch.vue'
    import IconSupport from '@/components/icons/IconSupport.vue'
    import IconCommunity from '@/components/icons/IconCommunity.vue'
    import { profile } from '@/store/user/profile'

</script>