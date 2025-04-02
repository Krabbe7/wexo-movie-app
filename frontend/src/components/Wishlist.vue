<template>
  <div class="wishlist">
    <h1>My wishlist</h1>

    <!-- Vis en loading-indikator mens ønskelisten indlæses -->
    <div class="loading-color" v-if="loading">Loading...</div>

    <!-- Hvis ønskelisten er tom, vis en besked -->
    <div class="Tom-liste" v-else-if="wishlist.length === 0">
      Your wishlist is empty.
    </div>

    <!-- Når ønskelisten er indlæst og ikke tom, vis filmene -->
    <div v-else class="movie-list">
      <!-- Iterer over alle film i ønskelisten og vis hver film -->
      <div
        v-for="movie in wishlist"
        :key="movie.id"
        class="movie-card"
        @click="goToMovieDetails(movie.id)"
      >
        <!-- Wishlist-knap i øverste venstre hjørne af hver filmkort -->
        <div class="wishlist-button">
          <WishlistButton :movie="movie" :wishlist="wishlist" />
        </div>

        <!-- Vis filmplakat -->
        <img :src="movie.poster" alt="Movie Poster" />

        <!-- Vis filmens titel under billedet -->
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Importer nødvendige moduler og komponenter
import { db, auth } from "../Services/FirebaseConfig" // Firebase-databasen og autentificering
import { useRouter } from "vue-router" // Brug router til navigation
import { ref, onMounted } from "vue" // Vue hooks
import { doc, onSnapshot } from "firebase/firestore" // Firebase funktioner til at hente data i realtid
import WishlistButton from "./WishlistButton.vue" // Importer knappen til at tilføje fjern fra ønskelisten

// Definer lokale reaktive variabler
const router = useRouter() // Vue Router instans
const wishlist = ref([]) // Brugerens ønskeliste
const loading = ref(true) // Indikator for indlæsning af data

// Funktion til at hente brugerens ønskeliste fra Firestore
const fetchWishlist = async () => {
  const user = auth.currentUser // Hent den nuværende bruger
  if (!user) return // Hvis der ikke er nogen bruger, afslut funktionen

  const wishlistRef = doc(db, "wishlists", user.uid) // Referencen til ønskelisten i Firestore

  // Lyt på ændringer i ønskelisten i realtid
  onSnapshot(wishlistRef, (snapshot) => {
    if (snapshot.exists()) {
      // Opdater ønskelisten med data fra Firestore, og cache den i localStorage
      wishlist.value = snapshot.data().movies || []
      localStorage.setItem(
        `wishlist_${user.uid}`,
        JSON.stringify(wishlist.value)
      ) // Gem i localStorage som cache
    } else {
      // Hvis ønskelisten ikke eksisterer, sæt den som tom
      wishlist.value = []
    }

    loading.value = false // Sæt loading til false, når data er hentet
  })
}

// Funktion til at navigere til detaljesiden for en film
const goToMovieDetails = (movieId) => {
  router.push({ name: "movie-details", params: { id: movieId } })
}

// Lyt på ændringer i brugerens login-status
onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) fetchWishlist() // Hvis brugeren er logget ind, hent ønskelisten
  })
})
</script>

<style scoped>
.wishlist {
  text-align: center;
}

.Tom-liste {
  color: #ffffff;
  text-align: center;
  margin-top: 70px;
  font-size: 20px;
}
</style>
