// src/utils/updateToast.ts
import { Toast } from "bootstrap";

export function showToast() {
    let liveToastElement = document.querySelector('#liveToast')
    if (!liveToastElement) return;
    new Toast(liveToastElement, { autohide: true, delay: 10000, animation: true }).show()
}