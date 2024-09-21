import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router/route'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendar, faStar, faEnvelope, faBookmark as solidBookmark, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faBookmark, faSmile } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)

library.add(faCalendar);
library.add(faStar);
library.add(faEnvelope);
library.add(faBookmark)
library.add(faSmile)
library.add(solidBookmark)
library.add(faThumbsUp)

app.component('font-awesome-icon', FontAwesomeIcon);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia)
app.use(router)
app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
})

app.mount('#q-app')
