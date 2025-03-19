<template>
  <div class="home">
    <h1>Movie Genres</h1>

    <div v-if="loading">Loading...</div>

    <div v-else>
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <h2>{{ genre.name }} ({{ genreCount[genre.id] }} movies)</h2>
        <div class="movie-list">
          <div
            v-for="movie in visibleMovies[genre.id]"
            :key="movie.id"
            class="movie-card"
          >
            <img :src="movie.poster" alt="Movie Poster" />
            <h3>{{ movie.title }}</h3>
            <p>Release Date: {{ movie.releaseDate }}</p>
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
import axios from "axios" // Import axios
import { ref, onMounted } from "vue"

const genres = ref([]) // Store genres
const genreMovies = ref({}) // Store movies for each genre
const genreCount = ref({}) // Store the number of movies per genre
const visibleMovies = ref({}) // Store the movies that should be visible
const loading = ref(true) // Loading status
const limit = 5 // Number of movies to load per click

// Fetch genres and movies from the backend
const fetchGenresAndMovies = async () => {
  try {
    loading.value = true

    // Fetch genres from the backend
    const genreResponse = await axios.get(
      "http://localhost:5000/api/movies/genres"
    )
    genres.value = genreResponse.data // Update genres

    // Fetch movies for each genre
    for (const genre of genres.value) {
      const movieResponse = await axios.get(
        "http://localhost:5000/api/movies/moviesbygenre",
        {
          params: { genreId: genre.id }, // Send genreId as query param
        }
      )

      genreMovies.value[genre.id] = movieResponse.data // Update movies for genre
      genreCount.value[genre.id] = movieResponse.data.length // Update movie count for genre
      visibleMovies.value[genre.id] = movieResponse.data.slice(0, limit) // Show first set of movies
    }
  } catch (error) {
    console.error("Failed to fetch genres and movies:", error)
  } finally {
    loading.value = false
  }
}

// Load more movies for a given genre
const loadMoreMovies = (genre) => {
  const currentVisibleMovies = visibleMovies.value[genre.id]
  const allMovies = genreMovies.value[genre.id]

  // Load next set of movies by slicing the next chunk
  const nextMovies = allMovies.slice(
    currentVisibleMovies.length,
    currentVisibleMovies.length + limit
  )

  // Update visible movies for that genre
  visibleMovies.value[genre.id] = [...currentVisibleMovies, ...nextMovies]
}

// Call the fetch function when the component is mounted
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
