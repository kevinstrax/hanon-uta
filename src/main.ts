import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import './style.scss'
import App from './App.vue'

const head = createHead()
import router from './router'
import tooltipDirective from '@/directives/tooltip.ts'
import dropdownDirective from '@/directives/dropdown.ts'

import VueLazyload from 'vue-lazyload'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


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

app.directive('tooltip', tooltipDirective);
app.directive('dropdown', dropdownDirective);

app.mount('#app');