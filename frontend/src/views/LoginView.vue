<template>
  <div class="login-view-container">
    <Login v-if="isLogin" />
    <SignupForm v-else />
    <button @click="toggleForm">
      {{
        isLogin
          ? "New user? Signup here"
          : "Already have an account? Go to Login"
      }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue"
import SignupForm from "./../components/SignupForm.vue"
import Login from "./../components/Login.vue"

const isLogin = ref(true)

const toggleForm = () => {
  isLogin.value = !isLogin.value
}
</script>

<style lang="scss"></style>
