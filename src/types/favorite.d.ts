// types/favorites.d.ts

// 前提：version在从未同步过云端的情况默认都是0，每同步一次都version+1，同步时updateMs和syncMs设成同一时间
// 1. updateMs存在，syncMs不存在，说明本地有操作，且从未和云端同步。云端和本地取并集后，更新云端和本地, version使用远程+1；
// 2. updateMs存在，syncMs存在
//      updateMs > syncMs: 说明本地有更新但是没有同步；
//          localVersion > remoteVersion 不可能的情况（先远程更新成功，再更新本地version!）
//          localVersion == remoteVersion 说明本地有改动但是没有同步，本地覆盖远程，version+1
//          localVersion < remoteVersion 说明其他设备同步了远程，且本设备在没有和远程同步的情况下发生了修改，这种情况最好询问用户（用远程or本地or并集），但要额外交互，简单做可以直接取并集；
//      updateMs == syncMs: 通常说明刚刚同步，且本地没有任何修改
//          localVersion == remoteVersion: 正常，不用做任何操作
//          localVersion != remoteVersion: 异常情况，可能有多设备同时在操作，比如A同步远程的时间和B本地修改的时间一致，version最新的覆盖本地或远程，这种应该是边界case
//      updateMs < syncMs: 本地有异常情况，需要兜底逻辑
//          localVersion == remoteVersion: 修正updateMs
//          localVersion != remoteVersion: 最新的覆盖两端，修正数据
// 3. updateMs不存在，syncMs存在 ：说明本地没操作，且从未和云端同步。直接远程覆盖本地；
// 4. updateMs不存在，syncMs不存在：没操作过，啥也不用做
export interface FavoriteData {
    updateMs: number;
    syncMs: number;
    version: number;
    ids: string[]
}

export interface FavoriteCloud {
    updateMs: number;
    version: number;
    ids: string[]
}