import express from "express"
import tmdbService from "../services/tmdbService.js" // Importer din tmdbService
const router = express.Router()

//Henter filmgenre
router.get("/genres", async (req, res) => {
  try {
    const genres = await tmdbService.getGenres() // Kalder service for at hente data
    res.json(genres) // Sender filmdata til frontend
  } catch (error) {
    console.error("Error fetching movie genres:", error.message)
    res.status(500).json({ error: "Failed to fetch movie genres" })
  }
})

router.get("/moviesbygenre", async (req, res) => {
  try {
    const { genreId, pages = 5 } = req.query // Hent genreId og antal sider
    if (!genreId) {
      return res.status(400).json({ error: "Missing genreId parameter" })
    }

    const movies = await tmdbService.getMoviesByGenre(genreId, parseInt(pages)) // Sender videre til service
    res.json(movies)
  } catch (error) {
    console.error("Error fetching movies by genre:", error.message)
    res.status(500).json({ error: "Failed to fetch movies by genre" })
  }
})

router.get("/movie/:id", async (req, res) => {
  try {
    const movieId = req.params.id // Hent filmens ID fra URL
    const movie = await tmdbService.getMovieDetails(movieId) // Hent detaljer om filmen fra service
    res.json(movie) // Returner filmens detaljer
  } catch (error) {
    console.error("Error fetching movie details:", error.message)
    res.status(500).json({ error: "Failed to fetch movie details" })
  }
})

export default router
