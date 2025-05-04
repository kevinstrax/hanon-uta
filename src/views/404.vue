<script lang="ts" setup>
import { ref } from "vue";
import { when404Redirect } from "@/utils/404Redirect";
import InitialLoading from "@/components/InitialLoading.vue";

const baseURL = import.meta.env.BASE_URL;
const showContent = ref(false);
showContent.value = when404Redirect();

</script>

<template>
  <template v-if="showContent">
    <h3>404 - ページが見つかりません</h3>
    <p>お探しのページは存在しないか、移動した可能性があります。</p>
    <p>
      <a :href="baseURL">すぐに移動する場合はこちらをクリックしてください</a>
    </p>
  </template>
  <template v-else>
    <InitialLoading/>
  </template>
</template>

<style scoped>

</style>