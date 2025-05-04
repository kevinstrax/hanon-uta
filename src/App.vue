<script setup lang="ts">
import Nav from "@/components/Nav.vue";
import InitialLoading from "@/components/InitialLoading.vue";
import { useLoadingStore } from '@/stores/loading'
import { storeToRefs } from 'pinia'
import { use404Redirect } from "@/utils/404Redirect";

const loadingStore = useLoadingStore()
const { isInitialLoad } = storeToRefs(loadingStore)

use404Redirect();

</script>

<template>
  <template v-if="isInitialLoad">
    <InitialLoading />
  </template>
  <Nav />
  <router-view />
</template>

<style scoped>
</style>
