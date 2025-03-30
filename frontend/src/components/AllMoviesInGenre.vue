<template>
  <div class="container">
    <h1>{{ genreName }} Movies</h1>

    <div class="loading-color" v-if="loading">Loading...</div>

    <div v-else-if="movies.length === 0">No movies found in this genre.</div>

    <div v-else class="movie-list">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <!-- Wishlist-knap i øverste venstre hjørne -->
        <div class="wishlist-button">
          <WishlistButton :movie="movie" :wishlist="wishlist" />
        </div>

        <!-- Filmplakat -->
        <img :src="movie.poster" alt="Movie Poster" />

        <!-- Rating og titel under billedet -->
        <div class="movie-info">
          <p class="rating">{{ movie.rating.toFixed(1) }}</p>
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"
import WishlistButton from "./WishlistButton.vue"
import { auth, db } from "../Services/FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"

const route = useRoute()
const genreId = ref(route.params.id) // Henter genre-id fra URL
const genreName = ref("") // Gemmer navnet på genren
const movies = ref([]) // Film i genren
const loading = ref(true)
const wishlist = ref([]) // Ønskeliste

// Hent film for en specifik genre
const fetchMoviesByGenre = async () => {
  try {
    loading.value = true
    await fetchWishlist() // Hent wishlist først, så knapperne er korrekte fra start

    // Hent genre-navn
    const genreResponse = await axios.get(
      "http://localhost:5000/api/movies/genres"
    )
    const foundGenre = genreResponse.data.find((g) => g.id == genreId.value)
    genreName.value = foundGenre ? foundGenre.name : "Unknown"

    // Hent film i genren
    const movieResponse = await axios.get(
      "http://localhost:5000/api/movies/moviesbygenre",
      {
        params: { genreId: genreId.value },
      }
    )

    movies.value = movieResponse.data
  } catch (error) {
    console.error("Fejl ved hentning af film:", error)
  } finally {
    loading.value = false
  }
}

// Hent ønskeliste fra Firestore
const fetchWishlist = async () => {
  const user = auth.currentUser
  if (!user) return

  const wishlistRef = doc(db, "wishlists", user.uid)
  const wishlistSnap = await getDoc(wishlistRef)

  if (wishlistSnap.exists()) {
    wishlist.value = wishlistSnap.data().movies || []
  }
}

// Hent både film og ønskeliste når komponenten mountes
onMounted(async () => {
  await fetchMoviesByGenre()
  await fetchWishlist()
})
</script>
