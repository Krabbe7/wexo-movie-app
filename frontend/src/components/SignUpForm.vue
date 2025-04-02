<template>
  <div class="signup-form-container">
    <h1 class="Signup-titel">Sign up</h1>
    <!-- Formularet for tilmelding -->
    <form class="signup-form" @submit.prevent="handleSignup">
      <div class="form-input">
        <label>Email:</label>
        <!-- Inputfelt til e-mail -->
        <input type="email" v-model="email" required />
      </div>
      <div class="form-input">
        <label>Password:</label>
        <!-- Inputfelt til password -->
        <input type="password" v-model="password" required />
      </div>

      <!-- Knappen for at oprette en profil -->
      <button class="signup-btn" type="submit">Create profile</button>
    </form>
    <!-- Link til login, hvis brugeren allerede har en profil -->
    <p>
      Already got a user profile?
      <span class="LoginLink" @click="goToLogin"> Click here to log in</span>
    </p>
    <!-- Fejlmeddelelse vises, hvis der er en fejl -->
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <!-- Success besked vises, når oprettelsen af profil er succesfuld -->
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { signup } from "../Services/FirebaseConfig" // Importer signup-funktionen
import { useAuthStore } from "../stores/authStore" // Importer auth store for at gemme brugerens data
import { useRouter } from "vue-router" // Brug router til navigation

const router = useRouter() // Router til navigation mellem sider
const authStore = useAuthStore() // Auth store til at opbevare brugerens email
const email = ref("") // E-mail input felt
const password = ref("") // Password input felt
const errorMessage = ref("") // Fejlmeddelelse ved validering eller fejlslagen oprettelse
const successMessage = ref("") // Success meddelelse når brugerprofil er oprettet

// RegEx til validering af e-mail og password
// Udtryk for at validere en e-mailadresse
// Matcher en e-mailadresse, der indeholder:
// - Et brugernavn, der kan have alfanumeriske tegn, bindestreger og punkter
// - Et "@"-tegn, der adskiller brugernavnet fra domænet
// - Et domæne, der består af alfanumeriske tegn og bindestreger
// - En domæneudvidelse (som .com, .org, .dk) på 2-4 tegn
const emailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

// Udtryk for at validere en adgangskode
// Matcher en adgangskode, der indeholder:
// - Mindst ét bogstav (store eller små bogstaver)
// - Mindst ét tal
// - En længde på mindst 6 tegn (kun bogstaver og tal tilladt)
const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

// Funktion til at håndtere sign up
const handleSignup = async () => {
  errorMessage.value = "" // Nulstil fejlmeddelelse
  successMessage.value = "" // Nulstil success meddelelse

  // Valider e-mail
  if (!emailRegEx.test(email.value)) {
    errorMessage.value =
      "Invalid email address. Make sure it is written correctly (e.g. username@domain.com)."
    return
  }

  // Valider adgangskode (mindst 6 tegn, både bogstaver og tal)
  if (!passwordRegEx.test(password.value)) {
    errorMessage.value =
      "The password must be at least 6 characters long and contain both letters and numbers."
    return
  }

  // Kald signup-funktionen fra Firebase
  const result = await signup(email.value, password.value)

  // Håndter resultatet af sign-up forsøget
  if (result.success) {
    // Hvis succes, gem e-mail i auth store og vis success besked
    authStore.userEmail = result.user.email
    successMessage.value = `User with email: ${result.user.email} created successfully`
    alert("You are now registered as a user.")
    router.push({ name: "wishlist" }) // Naviger til ønskelisten efter succes
  } else {
    // Hvis fejl, vis fejlmeddelelse
    errorMessage.value = result.message
  }
}

// Naviger til login-siden, hvis brugeren allerede har en profil
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

/* Ændring af farve, når brugeren hover over login-linket */
.LoginLink:hover {
  color: #0404c7;
}
</style>
