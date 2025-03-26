<template>
  <button @click.stop="toggleWishlist">
    {{ isInWishlist ? "Remove from Wishlist" : "Add to Wishlist" }}
  </button>
</template>

<script setup>
import { ref, watchEffect } from "vue"
import { db, auth } from "../Services/FirebaseConfig"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

const props = defineProps({
  movie: Object,
  wishlist: Array,
})

const isInWishlist = ref(false)

// Funktion til at tjekke om filmen er i ønskelisten
const checkIfInWishlist = () => {
  isInWishlist.value =
    props.wishlist?.some((m) => m.id === props.movie.id) || false
}

// Reagerer på ændringer i `wishlist`
watchEffect(() => {
  checkIfInWishlist()
})

const toggleWishlist = async () => {
  const user = auth.currentUser
  if (!user) return alert("Please log in to manage your wishlist")

  const wishlistRef = doc(db, "wishlists", user.uid)

  if (isInWishlist.value) {
    await updateDoc(wishlistRef, { movies: arrayRemove(props.movie) })
    props.wishlist.splice(
      props.wishlist.findIndex((m) => m.id === props.movie.id),
      1
    )
  } else {
    await updateDoc(wishlistRef, { movies: arrayUnion(props.movie) })
    props.wishlist.push(props.movie)
  }

  checkIfInWishlist()
}
</script>
