<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useColorModeStore } from "@/stores/color-mode.ts";

const { isDark } = storeToRefs(useColorModeStore())
</script>

<template>
  <Transition name="fade">
    <div
        class="w-100 h-100 d-flex justify-content-center align-items-center"
        :class="isDark ? 'bg-dark' : 'bg-white'"
    >
      <div class="text-center">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
.fade-leave-to {
  opacity: 0;
}
</style>