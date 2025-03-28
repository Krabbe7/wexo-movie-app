import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router" // Sørg for, at du importerer din router
import "./assets/styles/global.css"

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router) // Brug routeren
app.mount("#app")
