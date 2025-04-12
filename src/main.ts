import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App);
app.use(createPinia());
app.use(VueLazyload, {
    lazyComponent: true,
    attempt: 3,
    throttleWait: 500,
    observer: true,
});
app.use(router);
app.mount('#app');