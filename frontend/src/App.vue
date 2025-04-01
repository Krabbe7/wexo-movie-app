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
          <li @click="goToHome">Home</li>
          <li>About us</li>
          <li>Contact</li>
        </ul>
      </div>

      <div class="right">
        <!-- Avatar container -->
        <div
          class="avatar-container"
          @click="handleAvatarClick"
          @mouseover="isUserMenuActive = true"
          @mouseleave="isUserMenuActive = false"
        >
          <img src="./assets/avatar.png" alt="User Avatar" class="avatar" />
          <!-- Dropdown-menu -->
          <div v-if="isUserMenuActive" class="user-dropdown" @click.stop>
            <p class="velkomstBesked">
              Hi {{ authStore.userEmail || "guest" }}!
            </p>

            <ul>
              <template v-if="authStore.userEmail">
                <li @click="goToWishlist">My wishlist</li>
                <li @click="authStore.signOutUser">Log ud</li>
              </template>

              <template v-else>
                <ul>
                  <li @click="goToLogin">Login</li>
                  <li @click="goToSignUp">Create profile</li>
                </ul>
              </template>
            </ul>
          </div>
        </div>
        <div class="hamburger" @click="toggleMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <div :class="['dropdown-menu', { active: isMenuOpen }]">
            <ul>
              <li @click="goToHome">Home</li>
              <li>About us</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
  <div class="main-container">
    <RouterView />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "./stores/authStore"
import { ref, onMounted } from "vue"

const router = useRouter()
const authStore = useAuthStore()

const isMobile = ref(false)
const isUserMenuActive = ref(false)
const isMenuOpen = ref(false)
const isAuthReady = ref(false)

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

const handleAvatarClick = () => {
  if (authStore.userEmail) {
    goToWishlist()
  } else {
    goToLogin()
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(async () => {
  await authStore.initializeAuth() // Sørg for at auth-data er hentet
  isAuthReady.value = true

  isMobile.value = window.innerWidth <= 768
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth <= 768
  })
})
</script>

<style>
body {
  margin: 0;
  background-color: #1e203c;
}
/* Generel styling for navbar */
.header-wrapper {
  width: 100%;
  background-color: #2e3a59;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: relative;
}
.velkomstBesked {
  color: #000000;
}
.left {
  flex: 1;
}

.logo {
  width: 100px;
}

.velkomstBeksed {
  color: #222222;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
}

.velkomstBeksed {
  color: #ffffff;
  margin-right: 20px;
}

.avatar-container {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
}

ul {
  margin: 0;
}
/* Dropdown-menu under avatar */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #2e3a59;
  color: rgb(255, 255, 255);

  border: 1px solid #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  width: 250px;
  z-index: 3;
  display: flex;
  flex-direction: column;
}

/* Dropdown indhold */

.user-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-dropdown li {
  padding: 8px;
  text-align: center;
  cursor: pointer;
}
.user-dropdown li:first-child {
  border-bottom: 1px solid #ffffff;
}
.user-dropdown li:hover {
  background-color: #3a4a75;
}

.user-dropdown p {
  margin: 0;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
  background-color: #1e203c;
  color: #ffffff;
}

.main-container {
  max-width: 1400px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 20px;
}

/* Responsivitet */
@media (max-width: 768px) {
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .center {
    display: none;
  }

  .hamburger {
    display: block;
    cursor: pointer;
    padding: 10px;
  }

  .bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 4px auto;
    background-color: #fff;
  }

  .dropdown-menu {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #2e3a59;
    text-align: center;
    z-index: 3;
  }

  .dropdown-menu.active {
    display: block;
  }

  .dropdown-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .dropdown-menu li:first-child {
    border-top: 1px solid #fff;
  }
  .dropdown-menu li {
    padding: 10px 0;
    cursor: pointer;
    color: white;
    border-bottom: 1px solid #fff;
  }

  .dropdown-menu li:hover {
    background-color: #3a4a75;
  }
}

@media (min-width: 769px) {
  .hamburger {
    display: none;
  }

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
    padding: 10px;
  }

  .center li:hover {
    background-color: #3a4a75;
  }
}
</style>
