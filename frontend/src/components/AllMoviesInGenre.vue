<template>
  <div class="movies-in-genre">
    <h1>{{ genreName }} Movies</h1>

    <div v-if="loading">Loading...</div>

    <div v-else-if="movies.length === 0">No movies found in this genre.</div>

    <div v-else class="movie-list">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <img :src="movie.poster" alt="Movie Poster" />
        <h3>{{ movie.title }}</h3>
        <p class="rating">{{ movie.rating.toFixed(1) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"

const route = useRoute()
const genreId = ref(route.params.id) // Henter genre-id fra URL
const genreName = ref("") // Gemmer navnet på genren
const movies = ref([]) // Film i genren
const loading = ref(true)

// Hent film for en specifik genre
const fetchMoviesByGenre = async () => {
  try {
    loading.value = true

    // Hent genrens navn fra backend (hvis nødvendigt)
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

onMounted(fetchMoviesByGenre)
</script>

<style scoped>
/* Style for movie list */
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

/* Style for movie cards */
.movie-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s ease;
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 10px;
}

.movie-card:hover {
  transform: scale(1.05);
}

.rating {
  font-weight: 600;
  border: 1px solid #000;
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
