<template>
  <header class="header-wrapper">
    <button @click="goToWishlist">Go to Wishlist</button>
  </header>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"
import { useRouter } from "vue-router"

const router = useRouter()

const goToWishlist = () => {
  router.push({ name: "wishlist" })
}
</script>
