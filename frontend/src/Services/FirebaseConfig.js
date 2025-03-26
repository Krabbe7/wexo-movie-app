// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "@firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize en instanse af Firebase Authentication
const auth = getAuth(app)
const db = getFirestore(app)

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    return { success: true, user: userCredential.user }
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        message:
          "Denne e-mail er allerede i brug. Brug venligst en anden e-mail.",
      }
    } else {
      return {
        success: false,
        message: "Oprettelse af bruger mislykkedes, prøv igen.",
      }
    }
  }
}

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, message: error.message, code: error.code }
  }
}

// Funktion til at tjekke, om en e-mail eksisterer i Firebase Authentication
export const checkIfEmailExists = async (email) => {
  const auth = getAuth()
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email)
    return methods.length > 0 // Hvis listen er tom, betyder det, at e-mailen ikke er oprettet
  } catch (error) {
    console.error("Fejl ved tjek af e-mail:", error)
    return false
  }
}

export const onAuthChange = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user ? user.email : null)
  })
}

export const logout = async () => {
  await signOut(auth)
}

export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
