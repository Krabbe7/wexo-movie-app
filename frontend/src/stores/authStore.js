import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { onAuthChange, logout } from "../Services/FirebaseConfig"

export const useAuthStore = defineStore("auth", () => {
  const userEmail = ref(null)
  const router = useRouter() // Vue Router til navigation

  onAuthChange((email) => {
    userEmail.value = email

    if (email) {
      router.push({ name: "wishlist" }) // Redirect til wishlist efter login
    }
  })

  const signOutUser = async () => {
    await logout()
    userEmail.value = null
    router.push({ name: "home" }) // Redirect til forsiden efter logout
  }

  return { userEmail, signOutUser }
})
