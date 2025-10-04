import axios from "axios";
import { getToken } from "./googleAuth.ts";
import type { GoogleUserInfo } from "@/types/google-user";

export async function getGoogleUserInfo() : Promise<GoogleUserInfo> {
    const token = getToken();
    if (!token) throw new Error("Not signed in");

    const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}
