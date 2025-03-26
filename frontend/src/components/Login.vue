<template>
  <div class="login-form-container">
    <h2>Login</h2>
    <form class="login-form" @submit.prevent="handleLogin">
      <div class="form-input">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-input">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { login, checkIfEmailExists } from "../Services/FirebaseConfig"
import { useAuthStore } from "../stores/authStore"

const authStore = useAuthStore()
const email = ref("")
const password = ref("")
const emailRegEx = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/
const errorMessage = ref("")
const successMessage = ref("")

const handleLogin = async () => {
  const result = await login(email.value, password.value)
  if (result.success) {
    authStore.userEmail = result.user.email
    successMessage.value = `User ${result.user.email} logged in successfully!`
  } else {
    if (!emailRegEx.test(email.value)) {
      errorMessage.value =
        "Ugyldig e-mailadresse. Sørg for at den er korrekt skrevet (fx brugernavn@domæne.com)."
      return
    }

    // Tjek om e-mailen er oprettet i Firebase
    const emailExists = await checkIfEmailExists(email.value)
    if (!emailExists) {
      errorMessage.value =
        "Ugyldig e-mail eller adgangskode. Tjek dine oplysninger og prøv igen."
      return
    }
  }
}
</script>
