<template>
  <header class="header-wrapper">
    <nav class="navbar">
      <div class="left">
        <router-link to="/" class="logo">Logo here</router-link>
      </div>

      <div class="center">
        <button @click="goToHome">Home</button>
      </div>

      <div class="right">
        <template v-if="authStore.userEmail">
          <button @click="goToWishlist">Go to Wishlist</button>
          <p>Logged in as: {{ authStore.userEmail }}</p>
          <button @click="authStore.signOutUser">Log out</button>
        </template>

        <button v-else @click="goToLogin">Login</button>
        <button @click="goToSignUp">Sign up</button>
      </div>
    </nav>
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

const goToSignUp = () => {
  router.push({ name: "signup" })
}

const goToHome = () => {
  router.push({ name: "home" })
}
</script>

<style scoped>
.header-wrapper {
  width: 100%;
  background-color: #f8f8f8;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.left {
  flex: 1;
}

.center {
  flex: 2;
  text-align: center;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
}

button {
  margin: 0 10px;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  background-color: #474747;
  color: white;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}

p {
  margin: 0 10px;
  font-size: 14px;
  color: #333;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  text-decoration: none;
}

.logo:hover {
  text-decoration: underline;
}
</style>
