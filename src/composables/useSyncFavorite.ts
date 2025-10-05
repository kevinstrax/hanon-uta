import { Toast } from "bootstrap";
import { debounceFn } from "@/utils/placeholderUtils.ts";
import { useStorageStore } from "@/stores/storage-store.ts";
import { useAuthStore } from "@/stores/auth-store.ts";
import { storeToRefs } from "pinia";
import { signIn } from "@/utils/googleAuth.ts";

export const useSyncFavorite = () => {
    const authStore = useAuthStore();
    const { isLoggedIn } = storeToRefs(authStore);
    const storageStore = useStorageStore();

    async function syncFavorites(toast: boolean) {
        if (!isLoggedIn.value) {
            await signIn();
        }
        await storageStore.loadFavorites().then((errorCode) => {
            toast && showToastDeb(errorCode >= 0)
        })
    }
    function showToast(success: boolean) {
        let liveToastElement;
        if (success) {
            liveToastElement = document.querySelector('#syncSuccToast')
        } else {
            liveToastElement = document.querySelector('#syncFailToast')
        }
        if (!liveToastElement) {
            return;
        }
        new Toast(liveToastElement, { autohide: true, delay: 2333, animation: true }).show()
    }
    const showToastDeb = debounceFn(showToast, 998)

    return {
        syncFavorites
    }
}