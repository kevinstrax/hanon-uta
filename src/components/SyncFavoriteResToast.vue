<script setup lang="ts">

</script>

<template>
  <div class="toast-container position-fixed top-50 start-50 translate-middle p-3">
    <div id="syncSuccToast"
         class="toast text-center align-items-center"
         role="alert"
         aria-live="assertive"
         aria-atomic="true">
      <div class="d-flex justify-content-center align-items-center px-3">
        <div class="toast-body flex-grow-1">
          お気に入りの曲を同期しました！
        </div>
      </div>
    </div>
  </div>
  <div class="toast-container position-fixed top-50 start-50 translate-middle p-3">
    <div id="syncFailToast"
      class="toast text-center align-items-center"
      role="alert"
      aria-live="assertive"
      aria-atomic="true">
      <div class="d-flex justify-content-center align-items-center px-3">
        <div class="toast-body flex-grow-1">
          通信エラーのため、同期できませんでした。
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>