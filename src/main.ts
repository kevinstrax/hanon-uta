import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const head = createHead()
import router from './router'
import { useTooltip } from '@/utils/useTooltip.ts'

import VueLazyload from 'vue-lazyload'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'


const app = createApp(App);
app.use(head)
app.use(createPinia());
app.use(VueLazyload, {
    lazyComponent: true,
    attempt: 3,
    throttleWait: 500,
    observer: true,
});
app.use(router);

const { tooltipDirective } = useTooltip();
app.directive('tooltip', tooltipDirective);

app.mount('#app');