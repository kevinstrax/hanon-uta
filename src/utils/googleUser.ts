import axios from "axios";
import { getToken } from "./googleAuth.ts";

export async function getGoogleUserInfo() {
    const token = getToken();
    if (!token) throw new Error("Not signed in");

    const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}
