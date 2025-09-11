// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { showToast } from "@/utils/updateToast.ts";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.onError((error: Error) => {
    showToast();
    console.log(`Switch router with error: ${error.message}`);
})

export default router