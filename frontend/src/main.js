import { createApp } from "vue"
import App from "./App.vue"
import router from "./router" // Sørg for, at du importerer din router

const app = createApp(App)
app.use(router) // Brug routeren
app.mount("#app")
