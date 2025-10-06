<script setup lang="ts">
import { useMessageToast } from "@/composables/useMessageToast.ts";
import { storeToRefs } from "pinia";
import { useColorModeStore } from "@/stores/color-mode.ts";

const { isDark } = storeToRefs(useColorModeStore())
const { toastConfig } = useMessageToast();

</script>

<template>
  <div class="toast-container position-fixed top-50 start-50 translate-middle p-3" >
    <div id="hononMessageToast"
         class="toast text-center align-items-center opacity-868"
         :class="isDark ? 'text-bg-light' : 'text-bg-dark'"
         role="alert"
         aria-live="assertive"
         aria-atomic="true">
      <div class="d-flex px-3"
      :class="toastConfig?.text_center ? 'justify-content-center align-items-center' : 'text-start'">
        <div v-if="toastConfig?.html" class="toast-body flex-grow-1" v-html="toastConfig.message"></div>
        <div v-else class="toast-body flex-grow-1">{{ toastConfig?.message }}
        </div>
        <button v-if="toastConfig?.close"
                :data-bs-theme="isDark ? 'light' : 'dark'"
                type="button"
                class="btn-close me-2 m-auto"
                data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>