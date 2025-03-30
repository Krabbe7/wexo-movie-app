<template>
  <div class="login-form-container">
    <h1 class="Login-titel">Login</h1>
    <form class="login-form" @submit.prevent="handleLogin">
      <div class="form-input">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-input">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <div class="LoginOpretButton">
        <button type="submit">Login</button>
      </div>
    </form>
    <p>
      Har du ikke en bruger?
      <span class="OpretLink" @click="goToSignUp">Opret her</span>
    </p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { login, checkIfEmailExists } from "../Services/FirebaseConfig"
import { useAuthStore } from "../stores/authStore"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()
const email = ref("")
const password = ref("")
const emailRegEx = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/
const errorMessage = ref("")
const successMessage = ref("")

const handleLogin = async () => {
  errorMessage.value = ""
  successMessage.value = ""

  if (!emailRegEx.test(email.value)) {
    errorMessage.value =
      "Ugyldig e-mailadresse. Sørg for at den er korrekt skrevet (fx brugernavn@domæne.com)."
    return
  }

  const result = await login(email.value, password.value)

  if (result.success) {
    authStore.userEmail = result.user.email
    successMessage.value = `User ${result.user.email} logged in successfully!`

    // Navigér til wishlist efter succesfuldt login
    router.push({ name: "wishlist" })
  } else {
    const emailExists = await checkIfEmailExists(email.value)
    if (!emailExists) {
      errorMessage.value =
        "Ugyldig e-mail eller adgangskode. Tjek dine oplysninger og prøv igen."
    }
  }
}

const goToSignUp = () => {
  router.push({ name: "signup" })
}
</script>

<style>
.Login-titel {
  color: #000000;
  margin-top: 20px;
}

.OpretLink {
  text-decoration: underline;
  cursor: pointer;
  color: #0000ff;
}

.OpretLink:hover {
  color: #0404c7;
}
</style>
