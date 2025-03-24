<template>
  <header class="header-wrapper">
    <button @click="goToWishlist">Go to Wishlist</button>

    <template v-if="authStore.userEmail">
      <p>Logged in as: {{ authStore.userEmail }}</p>
      <button @click="authStore.signOutUser">Log out</button>
    </template>
    <button v-else @click="goToLogin">Login</button>
  </header>

  <RouterView />
</template>

<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "./stores/authStore"

const router = useRouter()
const authStore = useAuthStore()

const goToWishlist = () => {
  router.push({ name: "wishlist" })
}

const goToLogin = () => {
  router.push({ name: "login" })
}
</script>
