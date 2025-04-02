<template>
  <button @click.stop="toggleWishlist" class="wishlist-btn">
    <div class="wishlist-icon">
      <i :class="isInWishlist ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
    </div>
  </button>
</template>

<script setup>
import { ref, defineProps, computed } from "vue"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../Services/FirebaseConfig"

const props = defineProps({
  movie: Object,
  wishlist: Array,
})

const isInWishlist = computed(() => {
  return props.wishlist.some((m) => m.id === props.movie.id)
})

const toggleWishlist = async () => {
  const user = auth.currentUser
  if (!user) return // Sikre at brugeren er logget ind

  const movieIndex = props.wishlist.findIndex((m) => m.id === props.movie.id)

  if (movieIndex === -1) {
    // Tilføjer film til wishlist
    props.wishlist.push(props.movie)
  } else {
    // Fjerne film fra wishlist
    props.wishlist.splice(movieIndex, 1)
  }

  // Update Firestore
  const wishlistRef = doc(db, "wishlists", user.uid) // Brugerens ønskeliste-dokument

  try {
    await setDoc(wishlistRef, { movies: props.wishlist }, { merge: true })
    console.log("Wishlist updated successfully")
  } catch (error) {
    console.error("Error updating wishlist:", error)
  }
}
</script>

<style scoped>
.wishlist-btn {
  position: absolute;
  top: 5px;
  left: 0px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.wishlist-icon {
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.7);
  /* Mørk baggrund */
  border-radius: 8px;
  /* Bløde hjørner */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.2s;
}

.wishlist-btn:hover .wishlist-icon {
  background: rgba(0, 0, 0, 0.9);
  /* Lidt lysere på hover */
  transform: scale(1.1);
}

.wishlist-icon i {
  font-size: 15px;
  color: white;
  transition: color 0.3s;
}

.fas.fa-bookmark {
  color: #f39c12;
  /* Guld-farvet når tilføjet */
}
</style>
