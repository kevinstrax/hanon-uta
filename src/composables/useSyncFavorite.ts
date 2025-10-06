import { useFavoriteStore } from "@/stores/favorite-store.ts";
import { useAuthStore } from "@/stores/auth-store.ts";
import { storeToRefs } from "pinia";
import { realTimeCheckLogin, signIn } from "@/utils/googleAuth.ts";
import { useMessageToast } from "@/composables/useMessageToast.ts";

export const useSyncFavorite = () => {
    const authStore = useAuthStore();
    const { isLoggedIn } = storeToRefs(authStore);
    const storageStore = useFavoriteStore();

    async function syncFavorites(toast: boolean) {
        await realTimeCheckLogin();
        if (!isLoggedIn.value) {
            await signIn();
        }
        await storageStore.loadFavorites().then((errorCode) => {
            toast && showToast(errorCode >= 0)
        })
    }
    function showToast(success: boolean) {
        const { show } = useMessageToast();
        if (success) {
            show('お気に入りの曲を同期しました！')
        } else {
            show('通信エラーのため、同期できませんでした。')
        }
    }

    return {
        syncFavorites
    }
}