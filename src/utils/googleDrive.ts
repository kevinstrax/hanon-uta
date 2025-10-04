import axios, { AxiosHeaders } from "axios";
import { getToken } from "./googleAuth.ts"; // 你的 auth.ts 获取 accessToken

const API_BASE = "https://www.googleapis.com/drive/v3";

// Axios 实例，统一挂载 Authorization
const driveAxios = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

// 请求拦截器，自动加 access_token
driveAxios.interceptors.request.use((config) => {
    const token = getToken();
    if (!token) throw new Error("Google not signed in");

    // 如果 headers 已经是 AxiosHeaders，则可以直接 set
    const headers = config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);

    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;

    return config;
});

// -------------------- 核心方法 --------------------

// 查找 favorites.json
export async function findFavoritesFile(): Promise<string | null> {
    const q = encodeURIComponent("name='favorites.json' and 'appDataFolder' in parents");
    const res = await driveAxios.get(`/files?q=${q}&spaces=appDataFolder&fields=files(id,name)`);
    return res.data.files?.[0]?.id ?? null;
}

// 下载 JSON
export async function loadFavorites(fileId: string): Promise<any> {
    const res = await driveAxios.get(`/files/${fileId}?alt=media`);
    return res.data;
}

// 创建文件（首次）
export async function createFavorites(initialData: any) {
    const boundary = "foo_bar_baz";
    const body =
        `--${boundary}\r\n` +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        JSON.stringify({ name: "favorites.json", parents: ["appDataFolder"] }) + "\r\n" +
        `--${boundary}\r\n` +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(initialData) + "\r\n" +
        `--${boundary}--`;

    const res = await axios.post(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
        body,
        {
            headers: {
                "Content-Type": `multipart/related; boundary=${boundary}`,
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

    return res.data; // { id: '...' }
}

// 更新文件
export async function updateFavorites(fileId: string, data: any) {
    const res = await driveAxios.patch(`/files/${fileId}?uploadType=media`, data);
    return res.data;
}
