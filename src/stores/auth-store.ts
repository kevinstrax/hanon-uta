// stores/auth-store.ts
import { defineStore } from "pinia";
import type { GoogleUserInfo } from "@/types/google-user";
import type { AccessToken } from "@/types/access-token";
import { JsonUtils } from "@/utils/jsonUtils.ts";

const ACCESS_TOKEN_KEY = "google_access_token";
const USER_KEY = "google_user";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: JsonUtils.fromJson<AccessToken>(localStorage.getItem(ACCESS_TOKEN_KEY)),
        userInfo: JsonUtils.fromJson<GoogleUserInfo>(localStorage.getItem(USER_KEY)),
    }),
    getters: {
        isLoggedIn: (state) => {
            if (!state.token?.access_token || !state.token?.expires_in) {
                return false;
            }
            return state.token?.expires_in > new Date().getTime() / 1000;
        },
    },
    actions: {
        setToken(token: AccessToken) {
            this.token = token;
            localStorage.setItem(ACCESS_TOKEN_KEY, JsonUtils.toJson(token));
        },
        clearToken() {
            this.token = null;
            localStorage.removeItem(ACCESS_TOKEN_KEY);
        },
        setUserInfo(info: GoogleUserInfo) {
            this.userInfo = info;
            localStorage.setItem(USER_KEY, JsonUtils.toJson(info));
        },
        clearUserInfo() {
            this.userInfo = null;
            localStorage.removeItem(USER_KEY);
        },
    },
});
