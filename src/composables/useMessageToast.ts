import { Toast } from "bootstrap";
import { ref } from "vue";
import { debounceFn } from "@/utils/placeholderUtils.ts";

interface ToastConfig  {
    message: string;
    delay: number;
    html: boolean;
    close: boolean;
    text_center: boolean;
}

const toastConfig = ref<ToastConfig>();

const showing = ref(false);
function handleShow(msg: string, opts?: { delay?: number, html?: boolean , close?: boolean, text_center?: boolean }) {
    if (showing.value) {
        return;
    }
    try {
        showing.value = true;
        let liveToastElement = document.querySelector('#hononMessageToast')
        if (!liveToastElement) {
            return;
        }
        toastConfig.value = {
            message: msg,
            delay: opts?.delay??2333,
            html: opts?.html??false,
            close: opts?.close??false,
            text_center: opts?.text_center??true,
        };
        new Toast(liveToastElement, { autohide: true, delay: toastConfig.value.delay, animation: true }).show()
    } finally {
        setTimeout(() => {
            showing.value = false;
        }, toastConfig.value?.delay??1 + 1000);
    }

}
const show = debounceFn(handleShow, 998)

export const useMessageToast = () => {
    return {
        show,
        toastConfig
    }
}