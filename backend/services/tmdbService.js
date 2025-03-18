import axios from "axios"
import dotenv from "dotenv"

dotenv.config() // Indlæs miljøvariabler fra .env filen

const API_KEY = process.env.TMDB_API_KEY //TMDb API-nøgle
const BASE_URL = "https://api.themoviedb.org/3"

// Hent genrer
const getGenres = async () => {
  try {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    const response = await axios.get(url)

    if (response.status !== 200) {
      console.error(`TMDb API Error: ${response.status} ${response.statusText}`)
      throw new Error("Failed to fetch genres from TMDb")
    }

    return response.data.genres // Returner genrerne
  } catch (error) {
    console.error("Error in getGenres:", error.message)
    throw new Error("Oops, something went wrong while fetching genres.")
  }
}

const getMoviesByGenre = async (genreId) => {
  try {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`
    const response = await axios.get(url)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch movies for genre ${genreId}`)
    }

    return response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      releaseDate: movie.release_date,
    }))
  } catch (error) {
    console.error("Error in getMoviesByGenre:", error.message)
    throw error
  }
}

// Eksporter funktionerne
export default {
  getGenres,
  getMoviesByGenre,
}
