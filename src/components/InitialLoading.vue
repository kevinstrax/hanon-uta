<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import { storeToRefs } from 'pinia'

const loadingStore = useLoadingStore()
const { isInitialLoad } = storeToRefs(loadingStore)

</script>

<template>
  <Transition name="fade">
    <div
        v-if="isInitialLoad"
        class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white"
        style="z-index: 1080;"
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