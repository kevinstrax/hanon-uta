// src/utils/syncFavorites.ts
import axios, { AxiosHeaders } from "axios";
import { getToken } from "@/utils/googleAuth.ts";

export const FILE_NAME = "hanon-uta-favorites.json";

export interface FavoriteData {
    updatedAt: number; // 始终是毫秒时间戳
    favorites: string[];
}

const API_BASE = "https://www.googleapis.com/drive/v3";

// 创建带自动 Authorization 的 axios 实例
function createDriveAxios(baseURL: string) {
    const instance = axios.create({ baseURL });
    instance.interceptors.request.use((config) => {
        const token = getToken();
        if (!token) throw new Error("Google not signed in");

        if (!config.headers) config.headers = new AxiosHeaders();
        const headers =
            config.headers instanceof AxiosHeaders
                ? config.headers
                : new AxiosHeaders(config.headers);

        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;

        return config;
    });
    return instance;
}

export const driveAxios = createDriveAxios(API_BASE);
export const uploadAxios = createDriveAxios("https://www.googleapis.com/upload/drive/v3");

// 查找文件
async function findFavoriteFile(): Promise<string | null> {
    const q = `name='${FILE_NAME}' and 'appDataFolder' in parents`;
    const res = await driveAxios.get("/files", {
        params: { q, spaces: "appDataFolder", fields: "files(id,name)" },
    });
    return res.data?.files?.[0]?.id ?? null;
}

// 下载
export async function downloadFavorites(): Promise<FavoriteData | null> {
    const fileId = await findFavoriteFile();
    if (!fileId) return null;

    const res = await driveAxios.get(`/files/${fileId}`, { params: { alt: "media" } });
    const raw = res.data ?? {};

    // 无论如何确保 updatedAt 为 number
    const updatedAt = Number(raw.updatedAt ?? Date.now());
    const favorites = Array.isArray(raw.favorites) ? raw.favorites : [];

    return { updatedAt, favorites };
}

// 上传（新增或更新）
export async function uploadFavorites(data: FavoriteData): Promise<void> {
    // 防御性处理：强制转换 updatedAt 为 number
    const payload: FavoriteData = {
        updatedAt: Number(data.updatedAt ?? Date.now()),
        favorites: Array.from(new Set(data.favorites ?? [])),
    };

    const fileId = await findFavoriteFile();

    if (fileId) {
        // 更新已有文件（简单 media 上传）
        await uploadAxios.patch(`/files/${fileId}`, payload, {
            params: { uploadType: "media" },
            headers: new AxiosHeaders().set("Content-Type", "application/json"),
        });
        return;
    }

    // 创建新文件（multipart 上传）
    const metadata = { name: FILE_NAME, parents: ["appDataFolder"] };
    const boundary = "-------314159265358979323846";
    const multipartBody =
        `--${boundary}\r\n` +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        JSON.stringify(metadata) +
        `\r\n--${boundary}\r\n` +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(payload) +
        `\r\n--${boundary}--`;

    await uploadAxios.post(`/files?uploadType=multipart&fields=id`, multipartBody, {
        headers: new AxiosHeaders().set("Content-Type", `multipart/related; boundary=${boundary}`),
    });
}

// 合并逻辑
export function mergeFavorites(
    local?: FavoriteData | null,
    remote?: FavoriteData | null
): FavoriteData {
    if (!local && !remote) return { updatedAt: Date.now(), favorites: [] };
    if (!local) return { ...remote!, updatedAt: Number(remote!.updatedAt) };
    if (!remote) return { ...local, updatedAt: Number(local.updatedAt) };

    const lt = Number(local.updatedAt || 0);
    const rt = Number(remote.updatedAt || 0);

    if (Math.abs(lt - rt) < 3000) {
        // 时间接近：合并集合
        return {
            updatedAt: Date.now(),
            favorites: Array.from(new Set([...local.favorites, ...remote.favorites])),
        };
    }

    return lt > rt
        ? { ...local, updatedAt: lt }
        : { ...remote, updatedAt: rt };
}
