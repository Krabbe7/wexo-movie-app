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
      Don't have a user profile?
      <span class="OpretLink" @click="goToSignUp"
        >Click here to create a profile</span
      >
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
      "Invalid email address. Make sure it is written correctly (e.g. username@domain.com)."
    return
  }

  const result = await login(email.value, password.value)

  if (result.success) {
    authStore.userEmail = result.user.email

    // Navigér til wishlist efter succesfuldt login
    router.push({ name: "wishlist" })
  } else {
    const emailExists = await checkIfEmailExists(email.value)
    if (!emailExists) {
      errorMessage.value =
        "Invalid email or password. Check your information and try again."
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
