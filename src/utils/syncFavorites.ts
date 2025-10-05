// src/utils/syncFavorites.ts
import axios, { AxiosHeaders } from "axios";
import { getToken } from "@/utils/googleAuth.ts";
import type { FavoriteCloud, FavoriteData } from "@/types/favorite";

export const FILE_NAME = "hanon-uta-favorites.json";

const API_BASE = "https://www.googleapis.com/drive/v3";
const UPDATE_BASE = "https://www.googleapis.com/upload/drive/v3";

// Create an axios instance with automatic authorization
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

// Find the file
async function findFavoriteFile(): Promise<string | null> {
    const q = `name='${FILE_NAME}' and 'appDataFolder' in parents`;
    const res = await driveAxios.get("/files", {
        params: { q, spaces: "appDataFolder", fields: "files(id,name)" },
    });
    return res.data?.files?.[0]?.id ?? null;
}

// download
export async function downloadFavorites(): Promise<FavoriteCloud> {
    const fileId = await findFavoriteFile();
    if (!fileId) {
        return {
            updateMs: 0, ids: [], version: 0, fileId: null
        }
    }
    const res = await driveAxios.get(`/files/${fileId}`, { params: { alt: "media" } });
    const raw = res.data ?? {};
    const updateMs = Number(raw.updateMs ?? 0);
    const ids = raw.ids ? raw.ids : [];
    const version = raw.version ?? 0;
    return { updateMs, ids, version, fileId };
}

// Upload (new or updated)
export async function uploadFavorites(data: FavoriteCloud, fileId: string | null): Promise<void> {
    if (!fileId) {
        fileId = await findFavoriteFile();
    }

    if (fileId) {
        // Update existing files (simple media upload)
        await uploadAxios.patch(`/files/${fileId}`, data, {
            params: { uploadType: "media" },
            headers: new AxiosHeaders().set("Content-Type", "application/json"),
        });
        return;
    }

    // Create a new file (multipart upload)
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

// A more robust synchronization strategy
export interface SyncResult {
    local: FavoriteData;
    cloud: FavoriteCloud;
    needUpdateCloud: boolean;
}

export class FavoriteSync {

    static sync(local: FavoriteData, cloud: FavoriteCloud): SyncResult {
        // Never operated locally, never synced, using the cloud
        if (local.updateMs === 0 && local.syncMs === 0) {
            return this.usingCloud(cloud);
        }
        // There are operations locally, never synced
        if (local.updateMs > 0 && local.syncMs === 0) {
            return this.smartMergeStrategy(local, cloud);
        }
        // Local data is abnormal and directly covered by the cloud
        if (local.updateMs === 0 && local.syncMs > 0) {
            return this.usingCloud(cloud);
        }
        // Local data is abnormal and directly covered by the cloud
        if (local.updateMs < local.syncMs) {
            return this.usingCloud(cloud);
        }
        // There are local updates that are not synchronized
        if (local.updateMs > local.syncMs) {
            return this.handleLocalUpdate(local, cloud);
        }
        // There is no operation locally, see if there is an update in the cloud
        if (local.updateMs === local.syncMs) {
            if (local.version < cloud.version) {
                return this.usingCloud(cloud);
            } else if (local.version > cloud.version) {
                return this.smartMergeStrategy(local, cloud);
            }
        }
        // Returns local data by default (no change)
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
            // This really shouldn't happen, log and merge
            console.warn('Unexpected version state, using merge strategy');
            return this.smartMergeStrategy(local, cloud);
        } else if (local.version === cloud.version) {
            // There are local modifications, the version is consistent, and the local cloud is covered
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
                    ids: [...local.ids],
                    fileId: null,
                },
                needUpdateCloud: true
            };
        } else { // local.version < cloud.version
            // Conflict Scenarios: A smarter merge strategy is recommended
            return this.smartMergeStrategy(local, cloud);
        }
    }

    private static smartMergeStrategy(local: FavoriteData, cloud: FavoriteCloud): SyncResult {
        // Smarter Merge Strategy:
        // 1. Priority will be given to retaining new items from both parties
        // 2. If the same item is in different states on both sides, it is determined by the timestamp
        const mergedSet = new Set<string>();

        // Add everything in the cloud
        cloud.ids.forEach(id => mergedSet.add(id));
        // Add everything locally (auto-deduplication)
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
                ids: ids,
                fileId: null,
            },
            needUpdateCloud: true
        };
    }

}
