<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useLoadingStore } from '@/stores/loading'

onBeforeMount(() => {
  useLoadingStore().completeLoading();
});
</script>

<template>
  <div class="row my-4 mt-0">
    <h4>あれ、ここはなにもありませんよ~</h4>
  </div>
</template>

<style scoped>

</style>