<template>
  <div class="wishlist">
    <h1>My wishlist</h1>

    <div class="loading-color" v-if="loading">Loading...</div>
    <div class="Tom-liste" v-else-if="wishlist.length === 0">
      Your wishlist is empty.
    </div>

    <div v-else class="movie-list">
      <div v-for="movie in wishlist" :key="movie.id" class="movie-card" @click="goToMovieDetails(movie.id)">
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
  </div>
</template>

<script setup>
  import { db, auth } from "../Services/FirebaseConfig"
  import { useRouter } from "vue-router"
  import { ref, onMounted } from "vue"
  import { doc, getDoc, onSnapshot } from "firebase/firestore"
  import WishlistButton from "./WishlistButton.vue"

  const router = useRouter()
  const wishlist = ref([]) // Brugerens ønskeliste
  const loading = ref(true)


  // Hent brugerens ønskeliste fra Firestore
  const fetchWishlist = async () => {
    const user = auth.currentUser
    if (!user) return

    const wishlistRef = doc(db, "wishlists", user.uid)

    onSnapshot(wishlistRef, (snapshot) => {
      if (snapshot.exists()) {
        wishlist.value = snapshot.data().movies || []
        localStorage.setItem(`wishlist_${user.uid}`, JSON.stringify(wishlist.value)) // Cache i localStorage
      } else {
        wishlist.value = []
      }

      loading.value = false
    })
  }

  const goToMovieDetails = (movieId) => {
    router.push({ name: "movie-details", params: { id: movieId } })
  }

  // Lyt efter login-ændringer
  onMounted(() => {
    auth.onAuthStateChanged((user) => {
      if (user) fetchWishlist()
    })
  })
</script>

<style scoped>
  .wishlist {
    text-align: center;
  }

  .Tom-liste {
    color: #ffffff;
    text-align: center;
    margin-top: 70px;
    font-size: 20px;
  }
</style>