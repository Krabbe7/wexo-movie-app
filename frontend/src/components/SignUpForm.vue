<template>
  <div class="signup-form-container">
    <h2>Sign up</h2>
    <form class="signup-form" @submit.prevent="handleSignup">
      <div class="form-input">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-input">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit">Sign Up</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { signup } from "../Services/FirebaseConfig"
import { useAuthStore } from "../stores/authStore"

const authStore = useAuthStore()
const email = ref("")
const password = ref("")
const errorMessage = ref("")
const successMessage = ref("")

const handleSignup = async () => {
  const result = await signup(email.value, password.value)
  if (result.success) {
    authStore.userEmail = result.user.email
    successMessage.value = `User ${result.user.email} created successfully!`
  } else {
    errorMessage.value = result.message
  }
}
</script>
