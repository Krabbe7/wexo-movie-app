<template>
  <div class="container">
    <h1>Movies</h1>

    <!-- Loader vises, når data hentes -->
    <div class="loading-color" v-if="loading">Loading...</div>

    <div v-else>
      <!-- Loop gennem alle genrer -->
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <div class="genre-header">
          <!-- Genre titel og antal film i denne genre -->
          <h2>{{ genre.name }} ({{ genreCount[genre.id] || 0 }} movies)</h2>
          <!-- Knappen for at se alle film i denne genre -->
          <button class="MoviesInGenre" @click="goToMoviesInGenre(genre.id)">
            See all {{ genre.name }} movies
          </button>
        </div>
        <div class="movie-list">
          <!-- Loop gennem filmene i den aktuelle genre -->
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
        <!-- Load flere film-knap, hvis der er flere film at vise -->
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
import axios from "axios"
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
const wishlist = ref([])
const CACHE_EXPIRY_TIME = 30 * 60 * 1000 // 30 minutter

const fetchWishlist = async () => {
  const user = auth.currentUser
  if (!user) return

  const wishlistRef = doc(db, "wishlists", user.uid)
  const wishlistSnap = await getDoc(wishlistRef)
  wishlist.value = wishlistSnap.exists() ? wishlistSnap.data().movies || [] : []
}

const fetchGenresAndMovies = async () => {
  try {
    loading.value = true
    const genreResponse = await axios.get(
      "http://localhost:5000/api/movies/genres"
    )
    genres.value = genreResponse.data

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

const loadMoviesForGenre = async (genre) => {
  try {
    const genreId = genre.id
    const currentTime = Date.now()
    const cacheKey = `genre-${genreId}`
    const cachedData = JSON.parse(localStorage.getItem(cacheKey))

    // Brug cache hvis den eksisterer og ikke er udløbet
    if (
      cachedData &&
      cachedData.timestamp &&
      currentTime - cachedData.timestamp < CACHE_EXPIRY_TIME
    ) {
      genreMovies.value[genreId] = cachedData
      genreCount.value[genreId] = cachedData.movies.length

      // Kun sæt visibleMovies hvis det ikke allerede er sat
      if (!visibleMovies.value[genreId]) {
        visibleMovies.value[genreId] = cachedData.movies.slice(0, limit)
      }

      return
    }

    const currentPage = page.value[genreId] || 1

    // Hent nye data fra API
    const movieResponse = await axios.get(
      "http://localhost:5000/api/movies/moviesbygenre",
      {
        params: { genreId, page: currentPage },
      }
    )

    const cached = cachedData?.movies || []
    const combinedMovies = [
      ...new Map(
        [...cached, ...movieResponse.data].map((m) => [m.id, m])
      ).values(),
    ]

    const updatedCache = {
      movies: combinedMovies,
      timestamp: currentTime,
      page: currentPage,
    }

    localStorage.setItem(cacheKey, JSON.stringify(updatedCache))
    genreMovies.value[genreId] = updatedCache
    genreCount.value[genreId] = combinedMovies.length

    if (!visibleMovies.value[genreId]) {
      visibleMovies.value[genreId] = combinedMovies.slice(0, limit)
    }
  } catch (error) {
    console.error("Could not load movies for genre:", error)
  }
}

const loadMoreMovies = async (genre) => {
  const genreId = genre.id
  const currentPage = (page.value[genreId] || 1) + 1
  page.value[genreId] = currentPage

  await loadMoviesForGenre(genre)

  const allMovies = genreMovies.value[genreId]?.movies || []
  const currentVisible = visibleMovies.value[genreId] || []
  const nextMovies = allMovies.slice(
    currentVisible.length,
    currentVisible.length + loadmoreLimit
  )

  visibleMovies.value[genreId] = [...currentVisible, ...nextMovies]
}

const goToMoviesInGenre = (genreId) => {
  router.push({ name: "movie-genre", params: { id: genreId } })
}

const goToMovieDetails = (movieId) => {
  router.push({ name: "movie-details", params: { id: movieId } })
}

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
