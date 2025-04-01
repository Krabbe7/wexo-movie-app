<template>
  <div v-if="movie" class="movie-details">
    <!-- Backdrop med titel og poster -->
    <div
      class="backdrop"
      :style="{ backgroundImage: `url(${movie.backdrop})` }"
    >
      <WishlistButton
        class="wishlist-btn-description"
        :movie="movie"
        :wishlist="wishlist"
      />
      <div class="backdrop-content">
        <h1 class="titel-movie-description">{{ movie.title }}</h1>
        <img :src="movie.poster" alt="Movie Poster" class="poster" />
      </div>
    </div>

    <!-- Trailer og detaljer under backdroppet -->
    <div class="details-container">
      <div class="movie-description">
        <p>{{ movie.description }}</p>
        <p><strong>Release Year:</strong> {{ movie.releaseYear }}</p>
        <p><strong>Genres:</strong> {{ movie.genres.join(", ") }}</p>
        <p><strong>Rating:</strong> {{ movie.rating }}/10</p>
        <p><strong>Director(s):</strong> {{ movie.directors.join(", ") }}</p>
      </div>

      <!-- Responsiv trailer -->
      <div v-if="movie.trailerUrl" class="trailer-container">
        <div class="trailer">
          <iframe
            :src="`${movie.trailerUrl.replace('watch?v=', 'embed/')}`"
            frameborder="0"
            allowfullscreen
            class="responsive-iframe"
          ></iframe>
        </div>
      </div>
    </div>

    <div class="content">
      <h2 class="actors-heading">Actors</h2>
      <div class="actors">
        <div v-for="actor in movie.actors" :key="actor.name" class="actor-card">
          <img v-if="actor.profile" :src="actor.profile" :alt="actor.name" />
          <p>{{ actor.name }} as {{ actor.character }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"
import WishlistButton from "./WishlistButton.vue"
import { auth, db } from "../Services/FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"

const wishlist = ref([])
const route = useRoute()
const movie = ref(null)

const fetchMovieDetails = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/movies/movie/${route.params.id}`
    )
    movie.value = response.data
  } catch (error) {
    console.error("Error retrieving movie details:", error)
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

watchEffect(() => {
  if (movie.value) {
    movie.value.isInWishlist = wishlist.value.some(
      (m) => m.id === movie.value.id
    )
  }
})

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

/* Backdrop med flexbox layout */
.backdrop {
  position: relative;
  width: 100%;
  height: 600px;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 15px 15px;
}

.backdrop::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000af;
  z-index: 1;
  border-radius: 0 0 10px 10px;
}

.wishlist-btn-description {
  z-index: 2;
}

.backdrop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  text-align: center;
}

.titel-movie-description {
  margin: 0 0 40px 0;
}

.poster {
  max-width: 250px;
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px #ffffff80;
}

/* Container for trailer og film-info */
.details-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  margin-top: 80px;
}

.movie-description {
  margin-top: 0;
  flex: 1;
  max-width: 100%;
  text-align: left;
  padding-right: 20px;
}
.movie-description p {
  border-top: 1px solid #ffffff;
  padding-top: 20px;
  box-sizing: border-box;
}
.movie-description p:first-child {
  border-top: 0;
  margin-top: 0;
  padding: 0;
}
.trailer-container {
  flex: 1;
  max-width: 50%;
  width: 100%;
}

.trailer {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.content {
  margin-bottom: 100px;
}

.actors-heading {
  margin-top: 80px;
}

.actors {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  column-gap: 20px;
  row-gap: 50px;
  margin-top: 70px;
  width: 100%;
}

.actor-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  height: 100%;
}

.actor-card p {
  min-height: 3em; /* Sørger for, at alle tekstblokke har samme højde */
  display: flex;
  align-items: flex-start; /* Tvinger teksten til at starte fra toppen */
  text-align: center;
}

.actor-card img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

@media (max-width: 850px) {
  .backdrop {
    height: 500px;
  }
  .details-container {
    flex-direction: column;
  }
  .poster {
    max-width: 200px;
  }

  .trailer-container {
    margin-top: 80px;
    max-width: 100%;
  }
}
</style>
