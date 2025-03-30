<template>
  <div class="login-view-container">
    <Login v-if="isLogin" />
  </div>
</template>

<script setup>
import { ref } from "vue"

import Login from "./../components/Login.vue"

const isLogin = ref(true)
</script>

<style lang="scss"></style>
