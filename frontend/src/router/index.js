import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../Services/FirebaseConfig";
import HomeView from "../views/HomeView.vue";
import AllMoviesInGenreView from "../components/AllMoviesInGenre.vue";
import MovieDetailsView from "../views/MovieDetailsView.vue";
import WishlistView from "../views/WishlistView.vue";
import SignUpView from "../views/SignUpView.vue";
import LoginView from "../views/LoginView.vue";

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
      meta: { requiresAuth: true }, // Markér denne rute som beskyttet
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
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const user = auth.currentUser; // Tjek, om der er en logget ind bruger

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Hvis ruten kræver autentificering, og brugeren ikke er logget ind
    if (!user) {
      alert("Log in to view your wishlist"); // Vis alert først
      next({ name: "login" }); // Omdiriger til login-siden
    } else {
      next(); // Brugeren er logget ind, fortsæt til ønsket rute
    }
  } else {
    next(); // Hvis ruten ikke kræver autentificering, fortsæt som normalt
  }
});

export default router;
