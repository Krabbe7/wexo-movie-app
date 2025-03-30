<template>
  <div class="signup-form-container">
    <h1 class="Signup-titel">Sign up</h1>
    <form class="signup-form" @submit.prevent="handleSignup">
      <div class="form-input">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-input">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit">Opret bruger</button>
    </form>
    <p>
      Har du allerede en bruger?<span class="LoginLink" @click="goToLogin">
        Log ind her</span
      >
    </p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { signup } from "../Services/FirebaseConfig"
import { useAuthStore } from "../stores/authStore"
import { useRouter } from "vue-router"

const router = useRouter()

const authStore = useAuthStore()
const email = ref("")
const password = ref("")
const errorMessage = ref("")
const successMessage = ref("")

const emailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

const handleSignup = async () => {
  errorMessage.value = ""
  successMessage.value = ""

  // Valider e-mail
  if (!emailRegEx.test(email.value)) {
    errorMessage.value =
      "Ugyldig e-mailadresse. Sørg for at den er korrekt skrevet (fx brugernavn@domæne.com)."
    return
  }

  // Valider adgangskode (mindst 6 tegn, både bogstaver og tal)
  if (!passwordRegEx.test(password.value)) {
    errorMessage.value =
      "Adgangskoden skal være mindst 6 tegn og indeholde både bogstaver og tal."
    return
  }

  const result = await signup(email.value, password.value)

  if (result.success) {
    authStore.userEmail = result.user.email
    successMessage.value = `Bruger med email: ${result.user.email} oprettet succesfuldt`
    alert("Du er nu oprettet som bruger")
  } else {
    errorMessage.value = result.message
  }
}

const goToLogin = () => {
  router.push({ name: "login" })
}
</script>
<style>
.Signup-titel {
  color: #000000;
  margin-top: 20px;
}
.LoginLink {
  text-decoration: underline;
  cursor: pointer;
  color: #0000ff;
}

.LoginLink:hover {
  color: #0404c7;
}
</style>
