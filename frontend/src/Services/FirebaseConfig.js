// Importer nødvendige funktioner fra Firebase SDK
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

// Firebase-konfiguration med miljøvariabler
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // API-nøgle
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, // Auth-domeinen
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // Firebase projekt-ID
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Opbevaringsbucket
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // Sender-id for messaging
  appId: import.meta.env.VITE_FIREBASE_APP_ID, // Firebase app-id
}

// Initialiser Firebase-app'en
const app = initializeApp(firebaseConfig)
// Initialiser en instans af Firebase Authentication
const auth = getAuth(app)
// Initialiser Firestore-databasen
const db = getFirestore(app)

// Funktion til at oprette en ny bruger med e-mail og password
export const signup = async (email, password) => {
  try {
    // Forsøger at oprette bruger
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    return { success: true, user: userCredential.user } // Returner succes og brugerinfo
  } catch (error) {
    // Håndter fejl: Hvis e-mailen allerede er i brug
    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        message: "This email is already in use. Please use a different email.",
      }
    } else {
      // Håndter generelle fejl ved brugeroprettelse
      return {
        success: false,
        message: "User creation failed, please try again.",
      }
    }
  }
}

// Funktion til at logge en bruger ind med e-mail og password
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return { success: true, user: userCredential.user } // Returner succes og brugerinfo
  } catch (error) {
    // Returner fejlbesked hvis login fejler
    return { success: false, message: error.message, code: error.code }
  }
}

// Funktion til at tjekke, om en e-mail er registreret i Firebase Authentication
export const checkIfEmailExists = async (email) => {
  const auth = getAuth()
  try {
    // Forsøg at hente autentificeringsmetoder for den givne e-mail
    const methods = await fetchSignInMethodsForEmail(auth, email)
    return methods.length > 0 // Hvis der findes metoder (dvs. e-mailen er oprettet), returner true
  } catch (error) {
    console.error("Error checking email:", error)
    return false // Hvis der opstår en fejl, returner false
  }
}

// Funktion til at lytte på ændringer i brugerens autentificeringstilstand (logget ind eller ej)
export const onAuthChange = (callback) => {
  onAuthStateChanged(auth, (user) => {
    // Kald tilbagefunktionen med brugerens e-mail, hvis de er logget ind
    callback(user ? user.email : null)
  })
}

// Funktion til at logge brugeren ud
export const logout = async () => {
  await signOut(auth) // Log ud af Firebase Authentication
}

// Eksporter Firestore-databasen og autentificering samt nødvendige funktioner
export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
