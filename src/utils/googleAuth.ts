// utils/googleAuth.ts
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store.ts";
import { storeToRefs } from "pinia";
import type { TokenInfo } from "@/types/token-info";

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
                    verifyToken(response.access_token).then((tokenInfo) => {
                        if (tokenInfo) {
                            authStore.setToken({
                                access_token: response.access_token,
                                expires_in: Number.parseInt(tokenInfo.exp),
                            });
                        }
                        resolve();
                    })
                }
            }
        }).requestAccessToken();
    });
}

export function getToken(): string | null {
    const authStore = useAuthStore();
    const { isLoggedIn } = storeToRefs(authStore);
    return isLoggedIn.value ? authStore.token?.access_token??null : null;
}

async function verifyToken(token: string): Promise<TokenInfo | null> {
    try {
        const res = await axios.get<TokenInfo>(
            "https://oauth2.googleapis.com/tokeninfo",
            {
                params: { access_token: token },
            }
        );
        return res.data;
    } catch (err) {
        return null;
    }
}

export function logout() {
    const authStore = useAuthStore();
    authStore.clearToken();
    authStore.clearUserInfo();
}
