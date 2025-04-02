<template>
  <button @click.stop="toggleWishlist" class="wishlist-btn">
    <div class="wishlist-icon">
      <i :class="isInWishlist ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
    </div>
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
        alert("Please log in to manage your wishlist")
        return
      }

      const wishlistRef = doc(db, "wishlists", user.uid)
      const wishlistSnap = await getDoc(wishlistRef)

      // Optimistisk opdatering: Opdater isInWishlist først
      isInWishlist.value = !isInWishlist.value

      // Hvis ønskelisten ikke eksisterer, opret den
      if (!wishlistSnap.exists()) {
        await setDoc(wishlistRef, { movies: [] })
      }

      if (isInWishlist.value) {
        await updateDoc(wishlistRef, { movies: arrayUnion(props.movie) })
        props.wishlist.push(props.movie)
      } else {
        await updateDoc(wishlistRef, { movies: arrayRemove(props.movie) })
        props.wishlist.splice(
          props.wishlist.findIndex((m) => m.id === props.movie.id),
          1
        )
      }

    } catch (error) {
      console.error("Error updating wishlist:", error)
      alert("An error occurred. Please try again later.")
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