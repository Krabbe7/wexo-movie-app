import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import AllMoviesInGenre from "../components/AllMoviesInGenre.vue"
import MovieDetails from "../components/MovieDetails.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/genre/:id",
      name: "movie-genre",
      component: AllMoviesInGenre,
    },
    {
      path: "/movie/:id",
      name: "movie-details",
      component: MovieDetails,
    },
  ],
})

export default router
