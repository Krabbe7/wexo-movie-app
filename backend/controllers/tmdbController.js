import express from "express"
import tmdbService from "../services/tmdbService.js" // Importer din tmdbService, som håndterer forespørgsler til TMDB API

const router = express.Router()

// Route for at hente filmgenrer
router.get("/genres", async (req, res) => {
  try {
    const genres = await tmdbService.getGenres() // Kalder tmdbService for at hente genrer
    res.json(genres) // Sender genrerne som JSON til frontend
  } catch (error) {
    console.error("Error fetching movie genres:", error.message)
    res.status(500).json({ error: "Failed to fetch movie genres" }) // Returnerer en fejlmeddelelse ved fejl
  }
})

// Route for at hente film baseret på en genre
router.get("/moviesbygenre", async (req, res) => {
  try {
    const { genreId, pages = 5 } = req.query // Henter genreId og antal sider fra forespørgslen
    if (!genreId) {
      return res.status(400).json({ error: "Missing genreId parameter" }) // Returnerer en fejl, hvis genreId mangler
    }

    const movies = await tmdbService.getMoviesByGenre(genreId, parseInt(pages)) // Henter film baseret på genreId
    res.json(movies) // Sender filmene som JSON til frontend
  } catch (error) {
    console.error("Error fetching movies by genre:", error.message)
    res.status(500).json({ error: "Failed to fetch movies by genre" }) // Returnerer en fejlmeddelelse ved fejl
  }
})

// Route for at hente detaljer om en specifik film
router.get("/movie/:id", async (req, res) => {
  try {
    const movieId = req.params.id // Henter filmens ID fra URL-parametrene
    const movie = await tmdbService.getMovieDetails(movieId) // Henter detaljer om filmen fra tmdbService
    res.json(movie) // Returnerer filmens detaljer som JSON
  } catch (error) {
    console.error("Error fetching movie details:", error.message)
    res.status(500).json({ error: "Failed to fetch movie details" }) // Returnerer en fejlmeddelelse ved fejl
  }
})

export default router // Eksporterer routeren, så den kan bruges i andre filer
