<script setup lang="ts">
import Nav from "@/components/Nav.vue";
import InitialLoading from "@/components/InitialLoading.vue";
import { useLoadingStore } from '@/stores/loading'
import { storeToRefs } from 'pinia'
import { use404Redirect } from "@/utils/404Redirect";
import { useColorModeStore } from "@/stores/color-mode.ts";
import { onBeforeUnmount, onMounted } from "vue";

const newBase = "https://hanon-uta.github.io";
const oldPath = window.location.pathname.replace(/^\/hanon-uta/, "");
const newUrl = newBase + oldPath + window.location.search + window.location.hash;
window.location.replace(newUrl);

const loadingStore = useLoadingStore()
const { isInitialLoad } = storeToRefs(loadingStore)

const colorMode = useColorModeStore()

onMounted(() => {
  colorMode.init()
})

onBeforeUnmount(() => {
  colorMode.destroy()
})

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
