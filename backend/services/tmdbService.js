import axios from "axios"
import dotenv from "dotenv"

dotenv.config() // Indlæs miljøvariabler fra .env filen

const API_KEY = process.env.TMDB_API_KEY //TMDb API-nøgle
const BASE_URL = "https://api.themoviedb.org/3"

// Hent genrer
const allowedGenres = [
  "Action",
  "Comedy",
  "Thriller",
  "War",
  "Romance",
  "Drama",
  "Crime",
  "Documentary",
  "Horror",
]

const getGenres = async () => {
  try {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    const response = await axios.get(url)

    if (response.status !== 200) {
      console.error(`TMDb API Error: ${response.status} ${response.statusText}`)
      throw new Error("Failed to fetch genres from TMDb")
    }

    // Filtrer kun de tilladte genrer
    return response.data.genres.filter((genre) =>
      allowedGenres.includes(genre.name)
    )
  } catch (error) {
    console.error("Error in getGenres:", error.message)
    throw new Error("Oops, something went wrong while fetching genres.")
  }
}
const getMoviesByGenre = async (genreId, pages = 5) => {
  try {
    let allMovies = []

    for (let page = 1; page <= pages; page++) {
      // <= pages sikrer, at vi henter alle sider
      const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=${page}`
      const response = await axios.get(url)

      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch movies for genre ${genreId} on page ${page}`
        )
      }

      const movies = response.data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://placehold.co/500x750?text=No+Avalible+Image",
        rating: movie.vote_average,
      }))

      allMovies = [...allMovies, ...movies]
    }

    return allMovies
  } catch (error) {
    console.error("Error in getMoviesByGenre:", error.message)
    throw error
  }
}

const getMovieDetails = async (movieId) => {
  try {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
    const response = await axios.get(url)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch movie details for ID ${movieId}`)
    }

    const movie = response.data

    // Hent skuespillere og instruktører
    const actors = movie.credits.cast.slice(0, 10).map((actor) => ({
      name: actor.name,
      character: actor.character,
      profile: actor.profile_path
        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
        : null,
    }))

    const directors = movie.credits.crew
      .filter((person) => person.job === "Director")
      .map((director) => director.name)

    // Hent YouTube-trailer
    const trailer = movie.videos.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    )
    const trailerUrl = trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null

    return {
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      releaseYear: movie.release_date
        ? movie.release_date.split("-")[0]
        : "Unknown",
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,
      genres: movie.genres.map((genre) => genre.name),
      rating: movie.vote_average,
      actors,
      directors,
      trailerUrl, // YouTube trailer
    }
  } catch (error) {
    console.error("Error in getMovieDetails:", error.message)
    throw error
  }
}

// Eksporter funktionerne
export default {
  getGenres,
  getMoviesByGenre,
  getMovieDetails,
}
