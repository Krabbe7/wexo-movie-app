<template>
  <div class="home">
    <h1>Movie Genres</h1>

    <div v-if="loading">Loading...</div>

    <div v-else>
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <h2>{{ genre.name }} ({{ genreCount[genre.id] }} movies)</h2>
        <div class="movie-list">
          <div
            v-for="movie in genreMovies[genre.id]"
            :key="movie.id"
            class="movie-card"
          >
            <img :src="movie.poster" alt="Movie Poster" />
            <h3>{{ movie.title }}</h3>
            <p>Release Date: {{ movie.releaseDate }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios" // Importér axios
import { ref, onMounted } from "vue"

const genres = ref([]) // Lager til genrer
const genreMovies = ref({}) // Lager til filmene for hver genre
const genreCount = ref({}) // Lager til at holde styr på antal film pr. genre
const loading = ref(true) // Loader status

const fetchGenresAndMovies = async () => {
  try {
    loading.value = true

    // Hent genrer fra backend
    const genreResponse = await axios.get(
      "http://localhost:5000/api/movies/genres"
    )
    genres.value = genreResponse.data // Opdater genrerne

    // Hent film for hver genre
    for (const genre of genres.value) {
      const movieResponse = await axios.get(
        "http://localhost:5000/api/movies/moviesbygenre",
        {
          params: { genreId: genre.id }, // Send genreId som query-param
        }
      )

      genreMovies.value[genre.id] = movieResponse.data // Opdater filmene for genre
      genreCount.value[genre.id] = movieResponse.data.length // Opdater antal film for genre
    }
  } catch (error) {
    console.error("Failed to fetch genres and movies:", error)
  } finally {
    loading.value = false
  }
}

// Kald API'en når komponenten er monteret
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
