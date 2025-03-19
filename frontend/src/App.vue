<template>
  <header class="header-wrapper"></header>
  <HomeView />
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"
import HomeView from "./views/HomeView.vue"
</script>
