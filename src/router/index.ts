// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useMessageToast } from "@/composables/useMessageToast.ts";
import axios from "axios";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

const { show } = useMessageToast();
let targetRoute: string | null = null
router.beforeEach((to) => {
    targetRoute = to.fullPath
})
router.onError((error: Error) => {
    const targetPath = targetRoute??router.currentRoute.value.fullPath;
    axios.get(`/google19312be880b2f09b.html?t=${Date.now()}`).then(() => {
        show(`アプリに更新が検出されました。ページをリロードしてください。<a href="${ targetPath }" class="fw-bold" >リロード</a>`, {
            delay: 10000, html: true, close: true, text_center: false
        })
    }).catch((_: Error) => {
        show(`通信エラーが発生しました。後ほど再度お試しください。<a href="${ targetPath }" class="fw-bold" >再読み込み</a>`, {
            delay: 10000, html: true, close: true, text_center: false
        })
    })
    console.log(`Switch router with error: ${ error.message }`);
})

export default router