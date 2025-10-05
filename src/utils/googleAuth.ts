// utils/googleAuth.ts
import { useAuthStore } from "@/stores/auth-store.ts";
import axios from "axios";

declare const google: any;
interface TokenInfo {
    issued_to: string;
    audience: string;
    user_id: string;
    scope: string;
    expires_in: number;
    email?: string;
    verified_email?: boolean;
}

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

export async function isLogin() : Promise<boolean> {
    let token = getToken();
    if (!token) {
        return new Promise<boolean>(() => false)
    }
    return verifyToken(token)
        .then((tokenInfo) => tokenInfo !== null);
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
