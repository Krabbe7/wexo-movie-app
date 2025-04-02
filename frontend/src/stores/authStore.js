import { defineStore } from "pinia" // Importer Pinia for state management
import { auth } from "../Services/FirebaseConfig" // Importer Firebase auth instans
import { onAuthStateChanged } from "firebase/auth" // Importer onAuthStateChanged fra Firebase for at lytte på autentificeringstilstand
import { ref } from "vue" // Importer ref fra Vue for at skabe reaktive variabler
import { useRouter } from "vue-router" // Importer Vue Router for at kunne navigere mellem sider

// Definer en Pinia store kaldet "auth" til håndtering af autentificering
export const useAuthStore = defineStore("auth", () => {
  const userEmail = ref(null) // Definer en reaktiv variabel til at gemme brugerens e-mail
  const router = useRouter() // Initialisér routeren for at kunne navigere programmatisk

  // Funktion til at initialisere og lytte på ændringer i brugerens autentificeringstilstand
  const initializeAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userEmail.value = user.email // Hvis brugeren er logget ind, gem deres e-mail
        } else {
          userEmail.value = null // Hvis brugeren ikke er logget ind, sæt e-mailen til null
        }
        resolve() // Når autentificeringen er afsluttet, opløs løftet
      })
    })
  }

  // Funktion til at logge brugeren ud
  const signOutUser = async () => {
    await auth.signOut() // Log ud af Firebase Authentication
    userEmail.value = null // Tøm brugerens e-mail
    router.push({ name: "home" }) // Redirect brugeren til "home" siden efter logout
  }

  // Returner de funktioner og data, som skal være tilgængelige i komponenterne
  return { userEmail, initializeAuth, signOutUser }
})
