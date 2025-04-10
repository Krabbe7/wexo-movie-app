<template>
  <div class="container">
    <!-- Viser genrens navn og antal film, hvis data er indlæst -->
    <h1 v-if="!loading">
      {{ genreName }} Movies ({{ genreCount[genreId] || 0 }})
    </h1>

    <!-- Viser en loading-tekst, mens data hentes -->
    <div class="loading-color" v-if="loading">Loading...</div>

    <!-- Viser en besked, hvis der ikke findes nogen film i genren -->
    <div v-else-if="movies.length === 0">No movies found in this genre.</div>

    <!-- Viser listen af film -->
    <div v-else class="movie-list">
      <div v-for="movie in movies" :key="movie.id" class="movie-card" @click="goToMovieDetails(movie.id)">
        <!-- Wishlist-knap i øverste venstre hjørne -->
        <div class="wishlist-button">
          <WishlistButton :movie="movie" :wishlist="wishlist" />
        </div>

        <!-- Filmplakat -->
        <img :src="movie.poster" alt="Movie Poster" />

        <!-- Titel under billedet -->
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
  const genreName = ref("") // Gemmer genrens navn
  const genreCount = ref({}) // Gemmer antal film pr. genre
  const movies = ref([]) // Liste over film i genren
  const loading = ref(true) // Indikator for om data er under indlæsning
  const wishlist = ref([]) // Ønskeliste med brugerens gemte film
  const genreCache = new Map() // Caching af genrer for at optimere performance
  const CACHE_EXPIRY_TIME = 30 * 60 * 1000 // Cache-udløbstid (30 minutter)

  // Henter film for en specifik genre
  const fetchMoviesByGenre = async () => {
    try {
      loading.value = true
      await fetchWishlist() // Hent ønskeliste først

      // Tjek om filmene for genren er cachet i localStorage
      const cachedData = localStorage.getItem(`genre-${genreId.value}`)
      const currentTime = Date.now()

      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        // Tjek om cachen er gyldig (indenfor cache-udløbstid)
        if (currentTime - parsedData.timestamp < CACHE_EXPIRY_TIME) {
          // Brug cachede data fra localStorage
          genreName.value = parsedData.genreName
          movies.value = parsedData.movies
          genreCount.value[genreId.value] = parsedData.movies.length
          return // Brug cachen og stop videre hentning
        }
      }

      // Hvis der ikke er cachet data eller cachen er for gammel, hent nye data
      const genreResponse = await axios.get("http://localhost:5000/api/movies/genres")
      const movieResponse = await axios.get(
        "http://localhost:5000/api/movies/moviesbygenre",
        {
          params: { genreId: genreId.value },
        }
      )

      // Find genrens navn baseret på genreId
      const foundGenre = genreResponse.data.find((g) => g.id == genreId.value)
      genreName.value = foundGenre ? foundGenre.name : "Unknown"

      // Fjern duplikater fra filmene baseret på film-id
      const uniqueMovies = [
        ...new Map(movieResponse.data.map((movie) => [movie.id, movie])).values(),
      ]

      // Gem data i localStorage med timestamp
      const cacheData = {
        genreName: genreName.value,
        movies: uniqueMovies,
        timestamp: currentTime,
      }
      localStorage.setItem(`genre-${genreId.value}`, JSON.stringify(cacheData))

      // Opdater dataene i Vue
      movies.value = uniqueMovies
      genreCount.value[genreId.value] = uniqueMovies.length
    } catch (error) {
      console.error("Error retrieving movies:", error)
    } finally {
      loading.value = false // Stopper loading-indikatoren
    }
  }

  // Henter ønskeliste fra Firestore
  const fetchWishlist = async () => {
    const user = auth.currentUser
    if (!user) return

    const wishlistRef = doc(db, "wishlists", user.uid)
    const wishlistSnap = await getDoc(wishlistRef)
    wishlist.value = wishlistSnap.exists() ? wishlistSnap.data().movies || [] : []
  }

  // Navigerer til filmens detaljer
  const goToMovieDetails = (movieId) => {
    router.push({ name: "movie-details", params: { id: movieId } })
  }

  // Henter både film, når komponenten mountes
  onMounted(async () => {
    await fetchMoviesByGenre()
  })
</script>