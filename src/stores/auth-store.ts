// stores/auth-store.ts
import { defineStore } from "pinia";
import type { GoogleUserInfo } from "@/types/google-user";
import type { AccessToken } from "@/types/access-token";
import { JsonUtils } from "@/utils/jsonUtils.ts";
import { debounceFn } from "@/utils/placeholderUtils.ts";

const ACCESS_TOKEN_KEY = "google_access_token";
const USER_KEY = "google_user";

interface AutoState {
    token: AccessToken | null;
    userInfo: GoogleUserInfo | null;
    _time: number;
    _checkTimeoutFn: ReturnType<typeof debounceFn> | null;
}

export const useAuthStore = defineStore("auth", {
    state: () : AutoState => ({
        token: JsonUtils.fromJson<AccessToken>(localStorage.getItem(ACCESS_TOKEN_KEY)),
        userInfo: JsonUtils.fromJson<GoogleUserInfo>(localStorage.getItem(USER_KEY)),
        _time: Date.now(),
        _checkTimeoutFn: null,
    }),
    getters: {
        isLoggedIn: (state) => {
            if (!state.token?.access_token || !state.token?.expires_in) {
                return false;
            }
            return state.token?.expires_in >= state._time / 1000;
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
        startAutoCheck() {
            if (!this.token?.access_token || !this.token?.expires_in) {
                this._time = Date.now();
                return;
            }
            let delay = this.token.expires_in * 1000 - Date.now();
            if (delay < 0) {
                this._time = Date.now()
                return;
            }
            delay += 3000;
            if (this._checkTimeoutFn) {
                this._checkTimeoutFn.cancel?.()
            }
            this._checkTimeoutFn = debounceFn(() => this._time = Date.now(), delay);
            this._checkTimeoutFn();
        },
        refreshTime() {
            this._time = Date.now();
        }
    },
});
