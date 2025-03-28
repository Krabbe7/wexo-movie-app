<template>
  <button @click.stop="toggleWishlist">
    {{ isInWishlist ? "Remove from Wishlist" : "Add to Wishlist" }}
  </button>
</template>

<script setup>
import { ref, watchEffect } from "vue"
import { db, auth } from "../Services/FirebaseConfig"
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { useRouter } from "vue-router"

const router = useRouter()
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
  try {
    const user = auth.currentUser
    if (!user) {
      router.push({ name: "login" })
      alert("Log venligst ind for at administrere din ønskeliste")
      return
    }

    const wishlistRef = doc(db, "wishlists", user.uid)
    const wishlistSnap = await getDoc(wishlistRef)

    if (!wishlistSnap.exists()) {
      await setDoc(wishlistRef, { movies: [] })
    }

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
  } catch (error) {
    console.error("Fejl ved opdatering af ønskeliste:", error)
    alert("Der opstod en fejl. Prøv igen senere.")
  }
}
</script>
