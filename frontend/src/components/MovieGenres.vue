<template>
  <div class="container">
    <h1>Film genre</h1>

    <div v-if="loading">Loading...</div>

    <div v-else>
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <h2>{{ genre.name }} ({{ genreCount[genre.id] }} movies)</h2>
        <button class="MoviesInGenre" @click="goToMoviesInGenre(genre.id)">
          See all {{ genre.name }} movies
        </button>
        <div class="movie-list">
          <div
            v-for="movie in visibleMovies[genre.id]"
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
              <p class="rating">{{ movie.rating.toFixed(1) }}</p>
              <h3>{{ movie.title }}</h3>
            </div>
          </div>
        </div>
        <button
          v-if="visibleMovies[genre.id].length < genreCount[genre.id]"
          @click="loadMoreMovies(genre)"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios" // Importer axios
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { db, auth } from "../Services/FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import WishlistButton from "./WishlistButton.vue"

const router = useRouter()
const genres = ref([])
const genreMovies = ref({})
const genreCount = ref({})
const visibleMovies = ref({})
const loading = ref(true)
const limit = 5
const page = ref({})
const wishlist = ref([]) // Brugerens ønskeliste

// Hent brugerens ønskeliste fra Firestore
const fetchWishlist = async () => {
  const user = auth.currentUser
  if (!user) return

  const wishlistRef = doc(db, "wishlists", user.uid)
  const wishlistSnap = await getDoc(wishlistRef)
  wishlist.value = wishlistSnap.exists() ? wishlistSnap.data().movies || [] : []
}

// Hent genrer og film fra backend
const fetchGenresAndMovies = async () => {
  try {
    loading.value = true
    // Hent genrer fra backend
    const genreResponse = await axios.get(
      "http://localhost:5000/api/movies/genres"
    )
    genres.value = genreResponse.data // Opdater genrer
    // Hent film for alle genrer parallelt
    const genreMoviesPromises = genres.value.map((genre) =>
      loadMoviesForGenre(genre)
    )
    await Promise.all(genreMoviesPromises)
  } catch (error) {
    console.error("Kunne ikke hente genrer og film:", error)
  } finally {
    loading.value = false
  }
}

// Indlæs film for en specifik genre
const loadMoviesForGenre = async (genre) => {
  try {
    const genreId = genre.id
    const currentPage = page.value[genreId]
    const movieResponse = await axios.get(
      "http://localhost:5000/api/movies/moviesbygenre",
      {
        params: { genreId, page: currentPage }, // Send genreId og side som query-parametre
      }
    )

    // Fjern dubletter ved hjælp af Map
    const existingMovies = genreMovies.value[genreId] || []
    const uniqueMovies = [
      ...new Map(
        [...existingMovies, ...movieResponse.data].map((m) => [m.id, m])
      ).values(),
    ]

    genreMovies.value[genreId] = uniqueMovies
    genreCount.value[genreId] = uniqueMovies.length

    if (!visibleMovies.value[genreId]) {
      visibleMovies.value[genreId] = uniqueMovies.slice(0, limit)
    }
  } catch (error) {
    console.error("Kunne ikke indlæse film for genren:", error)
  }
}

// Indlæs flere film for en given genre
const loadMoreMovies = (genre) => {
  const genreId = genre.id
  const currentPage = page.value[genreId] + 1 // Inkrementér siden for genren
  page.value[genreId] = currentPage // Opdater siden for genren
  loadMoviesForGenre(genre) // Indlæs det næste sæt af film

  // Opdater synlige film for genren
  const allMovies = genreMovies.value[genreId]
  const currentVisibleMovies = visibleMovies.value[genreId]
  const nextMovies = allMovies.slice(
    currentVisibleMovies.length,
    currentVisibleMovies.length + limit
  )
  visibleMovies.value[genreId] = [...currentVisibleMovies, ...nextMovies]
}

const goToMoviesInGenre = (genreId) => {
  router.push({ name: "movie-genre", params: { id: genreId } })
}

const goToMovieDetails = (movieId) => {
  router.push({ name: "movie-details", params: { id: movieId } })
}

// Kald hentningsfunktionen, når komponenten bliver monteret
onMounted(() => {
  fetchGenresAndMovies()
  auth.onAuthStateChanged((user) => {
    if (user) fetchWishlist()
  })
})
</script>

<style scoped>
.container {
  padding: 0 20px;
}
h1,
h2 {
  color: #ffffff;
}
h1 {
  text-align: center;
}
h2 {
  margin-top: 70px;
}

/* Style for individual movie cards */

/* Responsive styling for small screens */
</style>
