// utils/googleAuth.ts
import { useAuthStore } from "@/stores/auth-store.ts";

declare const google: any;

export async function signIn() {
    const authStore = useAuthStore();

    return new Promise<void>((resolve, reject) => {
        google.accounts.oauth2.initTokenClient({
            client_id: "524317271155-976mchu33udh6c4ihgi9884env3kb3mp.apps.googleusercontent.com",
            scope: "https://www.googleapis.com/auth/drive.appdata profile",
            callback: (response : any) => {
                if (response.error) {
                    reject(response);
                } else {
                    authStore.setToken(response.access_token);
                    resolve();
                }
            }
        }).requestAccessToken();
    });
}

export function getToken(): string | null {
    const authStore = useAuthStore();
    return authStore.token;
}

export function logout() {
    const authStore = useAuthStore();
    authStore.clearToken();
}
