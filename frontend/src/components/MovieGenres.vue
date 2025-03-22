<template>
  <div class="home">
    <h1>Movie Genres</h1>

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
          >
            <img :src="movie.poster" alt="Movie Poster" />
            <h3>{{ movie.title }}</h3>

            <p class="rating">{{ movie.rating.toFixed(1) }}</p>
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
const router = useRouter()

const genres = ref([]) // Gemmer genrer
const genreMovies = ref({}) // Gemmer film for hver genre
const genreCount = ref({}) // Gemmer antallet af film pr. genre
const visibleMovies = ref({}) // Gemmer de film, der skal være synlige
const loading = ref(true) // Indlæsningsstatus
const limit = 5 // Antal film, der skal indlæses pr. klik
const page = ref({})

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

    // Filtrér dubletter fra listen baseret på movie.id
    const newMovies = movieResponse.data
    const existingMovies = genreMovies.value[genreId] || []

    // Brug et Set til at sikre unikke film
    const uniqueMovies = [
      ...new Map(
        [...existingMovies, ...newMovies].map((m) => [m.id, m])
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

// Kald hentningsfunktionen, når komponenten bliver monteret
onMounted(() => {
  fetchGenresAndMovies()
})
</script>

<style scoped>
/* Style for the genre section */
.genre-section {
  margin-bottom: 30px;
}

/* Style for movie cards container */
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

/* Style for individual movie cards */
.movie-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s ease;
}

/* Style for movie card images */
.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 10px;
}

/* Hover effect for movie card */
.movie-card:hover {
  transform: scale(1.05);
}

/* Style for movie card title and release date */
.movie-card h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.movie-card p {
  font-size: 14px;
  color: #505050;
}

.rating {
  font-weight: 600;
  border: 1px solid #000000;
  display: inline-block;
  width: fit-content;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Responsive styling for small screens */
@media (max-width: 768px) {
  .movie-card h3 {
    font-size: 14px;
  }

  .movie-card p {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .movie-card {
    padding: 8px;
  }

  .movie-card h3 {
    font-size: 12px;
  }

  .movie-card p {
    font-size: 10px;
  }
}
</style>
