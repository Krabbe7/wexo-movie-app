<template>
  <div v-if="movie" class="movie-details">
    <div
      class="backdrop"
      :style="{ backgroundImage: `url(${movie.backdrop})` }"
    ></div>

    <div class="content">
      <h1>{{ movie.title }}</h1>
      <img :src="movie.poster" alt="Movie Poster" class="poster" />

      <p><strong>Release Year:</strong> {{ movie.releaseYear }}</p>
      <p><strong>Description:</strong> {{ movie.description }}</p>
      <p><strong>Genres:</strong> {{ movie.genres.join(", ") }}</p>
      <p><strong>Rating:</strong> {{ movie.rating }}/10</p>

      <WishlistButton :movie="movie" :wishlist="wishlist" />
      <div v-if="movie.directors.length">
        <p><strong>Director(s):</strong> {{ movie.directors.join(", ") }}</p>
      </div>

      <div class="actors">
        <h3>Actors:</h3>
        <div v-for="actor in movie.actors" :key="actor.name" class="actor-card">
          <img v-if="actor.profile" :src="actor.profile" :alt="actor.name" />
          <p>{{ actor.name }} as {{ actor.character }}</p>
        </div>
      </div>

      <div v-if="movie.trailerUrl" class="trailer">
        <h3>Trailer</h3>
        <iframe
          :src="`${movie.trailerUrl.replace('watch?v=', 'embed/')}`"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>

      <button @click="goBack">⬅ Go Back</button>
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
const movie = ref(null)
const wishlist = ref([])

const fetchMovieDetails = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/movies/movie/${route.params.id}`
    )
    movie.value = response.data
  } catch (error) {
    console.error("Fejl ved hentning af filmdetaljer:", error)
  }
}

const fetchWishlist = async () => {
  const user = auth.currentUser
  if (!user) return

  const wishlistRef = doc(db, "wishlists", user.uid)
  const wishlistSnap = await getDoc(wishlistRef)

  if (wishlistSnap.exists()) {
    wishlist.value = wishlistSnap.data().movies || []
  }
}

const goBack = () => {
  router.push("/")
}

onMounted(async () => {
  await fetchMovieDetails()
  await fetchWishlist()
})
</script>

<style scoped>
.movie-details {
  color: white;
  text-align: center;
  position: relative;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  background-size: cover;
  background-position: center;
  filter: brightness(0.5);
}

.content {
  position: relative;
  padding: 20px;
  z-index: 2;
}

.poster {
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.actors {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.actor-card {
  width: 120px;
  text-align: center;
}

.actor-card img {
  width: 100%;
  border-radius: 10px;
}

.trailer iframe {
  width: 560px;
  height: 315px;
  margin-top: 20px;
}

button {
  margin-top: 20px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  background: #474747;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background: #303030;
}
</style>
