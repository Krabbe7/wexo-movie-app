import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import tmdbController from "./controllers/tmdbController.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use("/api/movies", tmdbController)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
