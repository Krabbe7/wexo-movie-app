<template>
  <header class="header-wrapper">
    <nav class="navbar">
      <div class="left">
        <router-link to="/" class="logo">
          <img
            class="logo"
            src="./assets/filmfeverwexo.png"
            alt="Filmfever Wexo"
          />
        </router-link>
      </div>

      <div class="center">
        <ul v-if="!isMobile">
          <li @click="goToHome">Hjem</li>
          <template v-if="authStore.userEmail">
            <li @click="goToWishlist">Min ønskeliste</li>
          </template>
          <li>Om os</li>
          <li>kontakt</li>
        </ul>
      </div>

      <div class="right">
        <template v-if="authStore.userEmail">
          <p>Hej {{ authStore.userEmail }}!</p>
          <button @click="authStore.signOutUser">Log out</button>
        </template>

        <template v-else>
          <button @click="goToLogin">Login</button>
          <button @click="goToSignUp">Sign up</button>
        </template>
      </div>

      <!-- Hamburger menu button for small screens -->
      <div class="hamburger" @click="toggleMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>

      <!-- Dropdown menu for mobile -->
      <div
        v-if="isMobile"
        class="dropdown-menu"
        :class="{ active: isDropdownActive }"
      >
        <ul>
          <li @click="goToHome">Hjem</li>
          <template v-if="authStore.userEmail">
            <li @click="goToWishlist">Min ønskeliste</li>
          </template>
          <li>Om os</li>
          <li>kontakt</li>
        </ul>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "./stores/authStore"
import { ref, onMounted } from "vue"

const router = useRouter()
const authStore = useAuthStore()

const isMobile = ref(false)
const isDropdownActive = ref(false)

const goToWishlist = () => {
  router.push({ name: "wishlist" })
}

const goToLogin = () => {
  router.push({ name: "login" })
}

const goToSignUp = () => {
  router.push({ name: "signup" })
}

const goToHome = () => {
  router.push({ name: "home" })
}

const toggleMenu = () => {
  isDropdownActive.value = !isDropdownActive.value
}

onMounted(() => {
  // Check if it's a mobile device on page load
  isMobile.value = window.innerWidth <= 768
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth <= 768
  })
})
</script>

<style scoped>
/* Generel styling for navbar */
body {
  margin: 0;
  padding: 0;
}

.header-wrapper {
  width: 100%;
  background-color: #2e3a59;
  padding: 10px 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: relative;
}

.left {
  flex: 1;
}

.logo {
  width: 100px;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
}

button {
  margin: 0 10px;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

button:hover {
  background-color: #45a049;
}

p {
  margin: 0 10px;
  font-size: 14px;
  color: #fff;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
}

.logo:hover {
  text-decoration: underline;
}

/* Responsivitet */
@media (max-width: 768px) {
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }

  .left {
    flex: 1;
  }

  .logo {
    width: 100px;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .hamburger {
    display: block;
    cursor: pointer;
    padding: 10px;
    z-index: 10; /* Sørger for at hamburger-ikonet er øverst */
  }

  .bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 4px auto;
    background-color: #fff;
  }

  /* Dropdown menu styling */
  .dropdown-menu {
    display: none;
    position: absolute;
    top: 60px; /* Placer dropdown-menuen lige under navbaren */
    left: 0;
    width: 100%; /* Dropdown-menuen skal være lige så bred som navbaren */
    background-color: #2e3a59;
    text-align: center;
    z-index: 100;
  }

  .dropdown-menu.active {
    display: block;
  }

  .dropdown-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .dropdown-menu li {
    padding: 10px 0;
    cursor: pointer;
    color: white;
    border-bottom: 1px solid #fff; /* Border mellem menupunkterne */
  }

  .dropdown-menu li:last-child {
    border-bottom: none; /* Fjern border-bottom på sidste li */
  }

  .dropdown-menu li:hover {
    background-color: #3a4a75; /* Hover-effekt på menupunkterne */
  }

  button {
    width: 100%;
    margin-top: 10px;
  }

  p {
    font-size: 12px;
  }
}

@media (min-width: 769px) {
  .hamburger {
    display: none; /* Skjul hamburger-menuen på større skærme */
  }
  /* Desktop-styling for ul og li */
  .center ul {
    display: flex;
    justify-content: center;
    gap: 50px;
    list-style: none;
    padding: 0;
  }

  .center li {
    cursor: pointer;
    color: white;
    font-size: 16px;
    text-align: center;
    border: none;
    padding: 10px;
    position: relative;
  }

  .center li:hover {
    background-color: #3a4a75;
  }

  .center li:last-child {
    border-left: none; /* Fjern border på sidste li */
  }

  button {
    display: inline-block;
  }

  p {
    font-size: 14px;
  }
}
</style>
