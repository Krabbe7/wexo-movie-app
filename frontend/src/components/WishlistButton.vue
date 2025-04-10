<template>
  <!-- Knap til at tilføje eller fjerne film fra ønskelisten -->
  <button @click.stop="toggleWishlist" class="wishlist-btn">
    <div class="wishlist-icon">
      <!-- Brug af FontAwesome ikon, ændrer sig afhængigt af om filmen er i ønskelisten -->
      <i :class="isInWishlist ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
    </div>
  </button>
</template>

<script setup>
// Importer nødvendige Vue funktioner og Firebase funktioner
import { computed } from "vue" // Brug Vue's reaktive funktioner
import { doc, setDoc } from "firebase/firestore" // Brug Firebase Firestore funktioner
import { auth, db } from "../Services/FirebaseConfig" // Importer Firebase autentificering og databaseinstans
import { useRouter } from "vue-router" // Importer router

const router = useRouter() // Vue Router instans
// Definer props for komponenten: 'movie' er filmobjektet, 'wishlist' er ønskelisten
const props = defineProps({
  movie: Object, // Objektet for den film, der tilføjes eller fjernes
  wishlist: Array, // Brugerens ønskeliste
})

// Beregn, om filmen allerede er i ønskelisten ved at sammenligne film-id'er
const isInWishlist = computed(() => {
  return props.wishlist.some((m) => m.id === props.movie.id) // Returnerer true, hvis filmen findes i ønskelisten
})

// Funktion til at tilføje eller fjerne filmen fra ønskelisten
const toggleWishlist = async () => {
  const user = auth.currentUser // Hent den nuværende bruger
  if (!user) {
    alert("Please log in to add movies to your wishlist") // Vis en alert-besked, hvis brugeren ikke er logget ind
    router.push({ name: "login" }) // Omdiriger brugeren til login-siden
    return // Afslut funktionen, hvis brugeren ikke er logget ind
  }

  const movieIndex = props.wishlist.findIndex((m) => m.id === props.movie.id) // Find filmens index i ønskelisten

  if (movieIndex === -1) {
    // Hvis filmen ikke er i ønskelisten, tilføj den
    props.wishlist.push(props.movie)
  } else {
    // Hvis filmen allerede er i ønskelisten, fjern den
    props.wishlist.splice(movieIndex, 1)
  }

  // Opdater ønskelisten i Firestore
  const wishlistRef = doc(db, "wishlists", user.uid) // Referencen til ønskelisten i Firestore

  try {
    // Gem den opdaterede ønskeliste i Firestore, og brug merge for ikke at overskrive andre data
    await setDoc(wishlistRef, { movies: props.wishlist }, { merge: true })
    console.log("Wishlist updated successfully") // Bekræft at ønskelisten er opdateret
  } catch (error) {
    // Hvis der opstår en fejl under opdateringen, log fejlen
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
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.2s; /* Glidende overgang ved hover */
}

/* Hover-effekt for ønskeliste-ikonet */
.wishlist-btn:hover .wishlist-icon {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.wishlist-icon i {
  font-size: 15px;
  color: white;
  transition: color 0.3s;
}

.fas.fa-bookmark {
  color: #f39c12;
}
</style>
