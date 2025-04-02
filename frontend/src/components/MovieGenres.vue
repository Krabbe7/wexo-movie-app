<template>
  <div class="container">
    <h1>Movies</h1>

    <div class="loading-color" v-if="loading">Loading...</div>

    <div v-else>
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <div class="genre-header">
          <h2>{{ genre.name }} ({{ genreCount[genre.id] || 0 }} movies)</h2>
          <button class="MoviesInGenre" @click="goToMoviesInGenre(genre.id)">
            See all {{ genre.name }} movies
          </button>
        </div>
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
              <h3>{{ movie.title }}</h3>
            </div>
          </div>
        </div>
        <button
          v-if="visibleMovies[genre.id].length < genreCount[genre.id]"
          @click="loadMoreMovies(genre)"
        >
          Load more...
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
const limit = 6
const loadmoreLimit = 6
const page = ref({})
const wishlist = ref([]) // Brugerens ønskeliste
const CACHE_EXPIRY_TIME = 30 * 60 * 1000 // 30 minutter

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
    console.error("Could not retrieve genres and movies:", error)
  } finally {
    loading.value = false
  }
}

// Indlæs film for en specifik genre
const loadMoviesForGenre = async (genre) => {
  try {
    const genreId = genre.id
    const currentTime = Date.now() // Tiden i millisekunder

    // Hvis filmene for denne genre er hentet, og de er inden for cache-udløbsintervallet, brug cache
    if (
      genreMovies.value[genreId] &&
      currentTime - genreMovies.value[genreId].timestamp < CACHE_EXPIRY_TIME
    ) {
      return // Brug den cachede version, ingen behov for at hente nye data
    }

    // Hvis cache er udløbet eller ikke findes, hent nye data fra API

    const currentPage = page.value[genreId] || 1
    const movieResponse = await axios.get(
      "http://localhost:5000/api/movies/moviesbygenre",
      {
        params: { genreId, page: currentPage },
      }
    )

    // Fjern dubletter ved hjælp af Map
    const existingMovies = genreMovies.value[genreId]?.movies || []
    const uniqueMovies = [
      ...new Map(
        [...existingMovies, ...movieResponse.data].map((m) => [m.id, m])
      ).values(),
    ]

    // Gem de hentede film og tilføj en timestamp
    genreMovies.value[genreId] = {
      movies: uniqueMovies,
      timestamp: currentTime, // Gem tidspunktet for når data blev hentet
    }
    genreCount.value[genreId] = uniqueMovies.length

    // Hvis der ikke er nogen synlige film for denne genre, vis de første 'limit' antal film
    if (!visibleMovies.value[genreId]) {
      visibleMovies.value[genreId] = uniqueMovies.slice(0, limit)
    }
  } catch (error) {
    console.error("Could not load movies for genre:", error)
  }
}

// Indlæs flere film for en given genre
const loadMoreMovies = (genre) => {
  const genreId = genre.id
  const currentPage = page.value[genreId] + 1 // Inkrementér siden for genren
  page.value[genreId] = currentPage // Opdater siden for genren
  loadMoviesForGenre(genre) // Indlæs det næste sæt af film

  // Opdater synlige film for genren
  const allMovies = genreMovies.value[genreId]?.movies || []
  const currentVisibleMovies = visibleMovies.value[genreId]
  const nextMovies = allMovies.slice(
    currentVisibleMovies.length,
    currentVisibleMovies.length + loadmoreLimit
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
.genre-section {
  margin-bottom: 100px;
}
.genre-header {
  margin-top: 50px;
}

@media (max-width: 494px) {
  .genre-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    gap: 10px;

    flex-wrap: wrap;
  }
}
</style>
