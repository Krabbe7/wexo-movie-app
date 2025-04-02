<template>
  <div class="container">
    <h1 v-if="!loading">
      {{ genreName }} Movies ({{ genreCount[genreId] || 0 }})
    </h1>

    <div class="loading-color" v-if="loading">Loading...</div>

    <div v-else-if="movies.length === 0">No movies found in this genre.</div>

    <div v-else class="movie-list">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-card"
        @click="goToMovieDetails(movie.id)"
      >
        <!-- Wishlist-knap i øverste venstre hjørne -->
        <div class="wishlist-button">
          <WishlistButton :movie="movie" :wishlist="wishlist" />
        </div>

        <!-- Filmplakat -->
        <img :src="movie.poster" alt="Movie Poster" />

        <!-- Rating og titel under billedet -->
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import WishlistButton from "./WishlistButton.vue"
import { auth, db } from "../Services/FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"

const route = useRoute()
const router = useRouter()
const genreId = ref(route.params.id) // Henter genre-id fra URL
const genreName = ref("") // Gemmer navnet på genren
const genreCount = ref({})
const movies = ref([]) // Film i genren
const loading = ref(true)
const wishlist = ref([]) // Ønskeliste
const genreCache = new Map() // Caching af genrer

// Hent film for en specifik genre
const fetchMoviesByGenre = async () => {
  try {
    loading.value = true
    await fetchWishlist() // Hent wishlist først

    // Brug cache til genres, hvis muligt
    const genrePromise = genreCache.has("genres")
      ? Promise.resolve(genreCache.get("genres"))
      : axios.get("http://localhost:5000/api/movies/genres")

    const moviesPromise = axios.get(
      "http://localhost:5000/api/movies/moviesbygenre",
      {
        params: { genreId: genreId.value },
      }
    )

    const [genreResponse, movieResponse] = await Promise.all([
      genrePromise,
      moviesPromise,
    ])

    // Opdater cache hvis nødvendigt
    if (!genreCache.has("genres") && genreResponse.data) {
      genreCache.set("genres", genreResponse.data)
    }

    // Find genrenavn
    const foundGenre = genreResponse.data.find((g) => g.id == genreId.value)
    genreName.value = foundGenre ? foundGenre.name : "Unknown"

    // Fjern duplikater baseret på film-id
    const uniqueMovies = [
      ...new Map(movieResponse.data.map((movie) => [movie.id, movie])).values(),
    ]

    movies.value = uniqueMovies
    genreCount.value[genreId.value] = uniqueMovies.length
  } catch (error) {
    console.error("Error retrieving movies:", error)
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
  wishlist.value = wishlistSnap.exists() ? wishlistSnap.data().movies || [] : []
}

const goToMovieDetails = (movieId) => {
  router.push({ name: "movie-details", params: { id: movieId } })
}

// Hent både film og ønskeliste når komponenten mountes
onMounted(async () => {
  await fetchMoviesByGenre()
})
</script>
