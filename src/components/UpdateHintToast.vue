<script lang="ts" setup>

</script>

<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div id="liveToast" aria-atomic="true" aria-live="assertive" class="toast" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          アプリに更新が検出されました。ページをリロードしてください。
          <a href="#" onclick="document.location.reload()">リロード</a>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>