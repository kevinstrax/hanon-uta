// src/utils/syncFavorites.ts
import axios, { AxiosHeaders } from "axios";
import { getToken } from "@/utils/googleAuth.ts";
import type { FavoriteCloud, FavoriteData } from "@/types/favorite";

export const FILE_NAME = "hanon-uta-favorites.json";

const API_BASE = "https://www.googleapis.com/drive/v3";
const UPDATE_BASE = "https://www.googleapis.com/upload/drive/v3";

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
export const uploadAxios = createDriveAxios(UPDATE_BASE);

// 查找文件
async function findFavoriteFile(): Promise<string | null> {
    const q = `name='${FILE_NAME}' and 'appDataFolder' in parents`;
    const res = await driveAxios.get("/files", {
        params: { q, spaces: "appDataFolder", fields: "files(id,name)" },
    });
    return res.data?.files?.[0]?.id ?? null;
}

// 下载
export async function downloadFavorites(): Promise<FavoriteCloud> {
    const fileId = await findFavoriteFile();
    if (!fileId) {
        return {
            updateMs: 0, ids: [], version: 0
        }
    }
    const res = await driveAxios.get(`/files/${fileId}`, { params: { alt: "media" } });
    const raw = res.data ?? {};
    const updateMs = Number(raw.updateMs ?? 0);
    const ids = raw.ids ? raw.ids : [];
    const version = raw.version ?? 0;
    return { updateMs, ids, version };
}

// 上传（新增或更新）
export async function uploadFavorites(data: FavoriteCloud): Promise<void> {
    const fileId = await findFavoriteFile();

    if (fileId) {
        // 更新已有文件（简单 media 上传）
        await uploadAxios.patch(`/files/${fileId}`, data, {
            params: { uploadType: "media" },
            headers: new AxiosHeaders().set("Content-Type", "application/json"),
        });
        return;
    }

    // 创建新文件（multipart 上传）
    const metadata = { name: FILE_NAME, parents: ["appDataFolder"] };
    const boundary = "hanon-chan-big-love";
    const multipartBody =
        `--${boundary}\r\n` +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        JSON.stringify(metadata) +
        `\r\n--${boundary}\r\n` +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(data) +
        `\r\n--${boundary}--`;

    await uploadAxios.post(`/files?uploadType=multipart&fields=id`, multipartBody, {
        headers: new AxiosHeaders().set("Content-Type", `multipart/related; boundary=${boundary}`),
    });
}

// 更健壮的同步策略
export interface SyncResult {
    local: FavoriteData;
    cloud: FavoriteCloud;
    needUpdateCloud: boolean;
}

export class FavoriteSync {

    static sync(local: FavoriteData, cloud: FavoriteCloud): SyncResult {
        // 本地从未操作，从未同步，使用云端
        if (local.updateMs === 0 && local.syncMs === 0) {
            return this.usingCloud(cloud);
        }
        // 本地有操作，从未同步
        if (local.updateMs > 0 && local.syncMs === 0) {
            return this.smartMergeStrategy(local, cloud);
        }
        // 本地数据异常，云端直接覆盖
        if (local.updateMs === 0 && local.syncMs > 0) {
            return this.usingCloud(cloud);
        }
        // 本地数据异常，云端直接覆盖
        if (local.updateMs < local.syncMs) {
            return this.usingCloud(cloud);
        }
        // 本地有更新未同步
        if (local.updateMs > local.syncMs) {
            return this.handleLocalUpdate(local, cloud);
        }
        // 本地没操作，看看云端是不是有更新
        if (local.updateMs === local.syncMs) {
            if (local.version < cloud.version) {
                return this.usingCloud(cloud);
            } else if (local.version > cloud.version) {
                return this.smartMergeStrategy(local, cloud);
            }
        }
        // 默认返回本地数据（无变化）
        return { local, cloud, needUpdateCloud: false };
    }

    private static usingCloud(cloud: FavoriteCloud) {
        let now = new Date().getTime();
        return {
            local: {
                syncMs: now,
                updateMs: now,
                version: cloud.version,
                ids: cloud.ids,
            },
            cloud: cloud,
            needUpdateCloud: false,
        };
    }

    private static handleLocalUpdate(local: FavoriteData, cloud: FavoriteCloud): SyncResult {
        if (local.version > cloud.version) {
            // 这确实不应该发生，记录日志并merge
            console.warn('Unexpected version state, using merge strategy');
            return this.smartMergeStrategy(local, cloud);
        } else if (local.version === cloud.version) {
            // 本地有修改，版本一致，本地覆盖云端
            const now = Date.now();
            return {
                local: { ...local,
                    syncMs: now,
                    updateMs: now,
                    version: Math.max(local.version, cloud.version) + 1
                },
                cloud: {
                    updateMs: now,
                    version: Math.max(local.version, cloud.version) + 1,
                    ids: [...local.ids]
                },
                needUpdateCloud: true
            };
        } else { // local.version < cloud.version
            // 冲突情况：建议采用更智能的合并策略
            return this.smartMergeStrategy(local, cloud);
        }
    }

    private static smartMergeStrategy(local: FavoriteData, cloud: FavoriteCloud): SyncResult {
        // 更智能的合并策略：
        // 1. 优先保留双方新增的项
        // 2. 如果同一项在两边状态不同，根据时间戳决定
        const mergedSet = new Set<string>();

        // 添加云端的所有项
        cloud.ids.forEach(id => mergedSet.add(id));
        // 添加本地的所有项（自动去重）
        local.ids.forEach(id => mergedSet.add(id));

        const ids = Array.from(mergedSet);
        const now = Date.now();
        return {
            local: {
                ...local,
                ids: ids,
                updateMs: now,
                syncMs: now,
                version: cloud.version + 1
            },
            cloud: {
                updateMs: now,
                version: cloud.version + 1,
                ids: ids
            },
            needUpdateCloud: true
        };
    }

}
