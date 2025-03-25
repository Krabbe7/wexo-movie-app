<template>
  <div class="wishlist">
    <h1>My Wishlist</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="wishlist.length === 0">Your wishlist is empty.</div>

    <div v-else class="movie-list">
      <div v-for="movie in wishlist" :key="movie.id" class="movie-card">
        <img :src="movie.poster" alt="Movie Poster" />
        <h3>{{ movie.title }}</h3>
        <button @click="toggleWishlist(movie)">Remove</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db, auth } from "../Services/FirebaseConfig" // Firebase-import
import { ref, onMounted } from "vue"
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"

const wishlist = ref([]) // Brugerens ønskeliste
const loading = ref(true)

// Hent brugerens ønskeliste fra Firestore
const fetchWishlist = async () => {
  const user = auth.currentUser
  if (!user) return

  const wishlistRef = doc(db, "wishlists", user.uid)
  const wishlistSnap = await getDoc(wishlistRef)

  if (wishlistSnap.exists()) {
    wishlist.value = wishlistSnap.data().movies || []
  } else {
    wishlist.value = []
  }

  loading.value = false
}

// Tilføj/fjern film fra ønskelisten
const toggleWishlist = async (movie) => {
  const user = auth.currentUser
  if (!user) return alert("Log in to manage your wishlist!")

  const wishlistRef = doc(db, "wishlists", user.uid)

  // Tjek om filmen allerede er på ønskelisten
  if (wishlist.value.some((m) => m.id === movie.id)) {
    // Hvis filmen er på listen, fjern den
    await updateDoc(wishlistRef, { movies: arrayRemove(movie) })
    wishlist.value = wishlist.value.filter((m) => m.id !== movie.id) // Opdater lokalt
  } else {
    // Hvis filmen ikke er på listen, tilføj den
    await updateDoc(wishlistRef, { movies: arrayUnion(movie) })
    wishlist.value.push(movie) // Opdater lokalt
  }
}

// Lyt efter login-ændringer
onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      fetchWishlist()
    } else {
      wishlist.value = [] // Nulstil ønskelisten ved logout
    }
  })
})
</script>

<style scoped>
.wishlist {
  text-align: center;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.movie-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.movie-card img {
  width: 100%;
  border-radius: 4px;
}

button {
  background-color: red;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
}
</style>
