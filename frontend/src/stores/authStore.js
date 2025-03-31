import { defineStore } from "pinia"
import { auth } from "../Services/FirebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { ref } from "vue"
import { useRouter } from "vue-router" // <--- IMPORTER ROUTER

export const useAuthStore = defineStore("auth", () => {
  const userEmail = ref(null)
  const router = useRouter() // <--- INITIALISÉR ROUTER

  const initializeAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userEmail.value = user.email
        } else {
          userEmail.value = null
        }
        resolve()
      })
    })
  }

  const signOutUser = async () => {
    await auth.signOut()
    userEmail.value = null
    router.push({ name: "home" }) // <--- Redirect til home efter logout
  }

  return { userEmail, initializeAuth, signOutUser }
})
