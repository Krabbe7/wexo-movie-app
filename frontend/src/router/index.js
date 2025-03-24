import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import AllMoviesInGenreView from "../components/AllMoviesInGenre.vue"
import MovieDetailsView from "../views/MovieDetailsView.vue"
import WishlistView from "../views/WishlistView.vue"
import SignUpView from "../views/SignUpView.vue"
import LoginView from "../views/LoginView.vue"

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
      component: AllMoviesInGenreView,
    },
    {
      path: "/movie/:id",
      name: "movie-details",
      component: MovieDetailsView,
    },
    {
      path: "/wishlist",
      name: "wishlist",
      component: WishlistView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUpView,
    },
  ],
})

export default router
