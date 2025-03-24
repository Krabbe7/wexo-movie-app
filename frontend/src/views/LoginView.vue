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
import { useRouter } from "vue-router"
import SignupForm from "./../components/SignupForm.vue"
import Login from "./../components/Login.vue"

const isLogin = ref(true)
const router = useRouter()

const toggleForm = () => {
  if (isLogin.value) {
    router.push("/signup")
  } else {
    isLogin.value = !isLogin.value
  }
}
</script>

<style lang="scss"></style>
