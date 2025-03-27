<template>
  <header class="header-wrapper">
    <nav class="navbar">
      <div class="left">
        <router-link to="/" class="logo">
          <img class="logo" src="./assets/filmfeverwexo.png" alt="Filmfever Wexo" />
        </router-link>
      </div>

      <div class="center">
        <ul v-if="!isMobile">
          <li @click="goToHome">Hjem</li>
          <template v-if="authStore.userEmail">
            <li @click="goToWishlist">Min ønskeliste</li>
          </template>
          <li>Om os</li>
          <li>Kontakt</li>
        </ul>
      </div>

      <div class="right">
        <template v-if="authStore.userEmail">
          <!-- Avatar-knap -->
          <div class="avatar-container" @click="toggleUserMenu">
            <img src="./assets/avatar.png" alt="User Avatar" class="avatar" />
          </div>

          <!-- Bruger-dropdown-menu -->
          <div v-if="isUserMenuActive" class="user-dropdown">
            <p class="velkomstBeksed">Hej {{ authStore.userEmail }}!</p>
            <ul>
              <li @click="goToWishlist">Min ønskeliste</li>
              <li @click="authStore.signOutUser">Log ud</li>
            </ul>
          </div>
        </template>

        <template v-else>
          <button @click="goToLogin">Login</button>
          <button @click="goToSignUp">Sign up</button>
        </template>
      </div>

      <!-- Hamburger menu for små skærme -->
      <div class="hamburger" @click="toggleMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>

      <!-- Mobil dropdown-menu -->
      <div v-if="isMobile" class="dropdown-menu" :class="{ active: isDropdownActive }">
        <ul>
          <li @click="goToHome">Hjem</li>
          <template v-if="authStore.userEmail">
            <li @click="goToWishlist">Min ønskeliste</li>
          </template>
          <li>Om os</li>
          <li>Kontakt</li>
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
  const isUserMenuActive = ref(false)

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

  const toggleUserMenu = () => {
    isUserMenuActive.value = !isUserMenuActive.value
  }

  onMounted(() => {
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


  .velkomstBeksed {
    color: #222222
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

  /* Avatar container */
  .avatar-container {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  /* Avatar billede */
  .avatar {
    width: 40px;
  }

  /* Dropdown-menu under avatar */
  .user-dropdown {
    position: absolute;
    top: 100%;
    /* Placerer dropdown lige under avataren */
    right: 0;
    background-color: white;
    color: black;
    border-radius: 5px;
    border: 1px solid #000000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 10px;
    width: 200px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }

  /* Dropdown indhold */
  .user-dropdown p {
    margin: 0;
    font-size: 14px;
    text-align: center;
    font-weight: bold;
    padding-bottom: 8px;
    border-bottom: 1px solid #ddd;
  }

  .user-dropdown ul {
    list-style: none;
    padding: 0;
    margin: 10px 0 0;
  }

  .user-dropdown li {
    padding: 8px;
    text-align: center;
    cursor: pointer;
  }

  .user-dropdown li:hover {
    background-color: #f0f0f0;
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
      z-index: 10;
      /* Sørger for at hamburger-ikonet er øverst */
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
      top: 60px;
      /* Placer dropdown-menuen lige under navbaren */
      left: 0;
      width: 100%;
      /* Dropdown-menuen skal være lige så bred som navbaren */
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
      border-bottom: 1px solid #fff;
      /* Border mellem menupunkterne */
    }

    .dropdown-menu li:last-child {
      border-bottom: none;
      /* Fjern border-bottom på sidste li */
    }

    .dropdown-menu li:hover {
      background-color: #3a4a75;
      /* Hover-effekt på menupunkterne */
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
      display: none;
      /* Skjul hamburger-menuen på større skærme */
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
      border-left: none;
      /* Fjern border på sidste li */
    }

    button {
      display: inline-block;
    }

    p {
      font-size: 14px;
    }
  }
</style>