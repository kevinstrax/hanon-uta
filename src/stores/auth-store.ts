// stores/auth-store.ts
import { defineStore } from "pinia";
import type { GoogleUserInfo } from "@/types/google-user";

const STORAGE_KEY = "google_access_token";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem(STORAGE_KEY) as string | null,
        userInfo: JSON.parse(localStorage.getItem("google_user") || "null") as GoogleUserInfo | null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
    actions: {
        setToken(token: string) {
            this.token = token;
            localStorage.setItem(STORAGE_KEY, token);
        },
        clearToken() {
            this.token = null;
            localStorage.removeItem(STORAGE_KEY);
        },
        loadToken() {
            const token = localStorage.getItem(STORAGE_KEY);
            if (token) this.token = token;
        },
        setUserInfo(info: GoogleUserInfo) {
            this.userInfo = info;
            localStorage.setItem("google_user", JSON.stringify(info));
        },
        clearUserInfo() {
            this.userInfo = null;
            localStorage.removeItem("google_user");
        },
    },
});
