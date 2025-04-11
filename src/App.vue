<script setup lang="ts">
import Nav from "@/components/Nav.vue";
import InitialLoading from "@/components/InitialLoading.vue";
import { useLoadingStore } from '@/stores/loading'
import { storeToRefs } from 'pinia'

const loadingStore = useLoadingStore()
const { isInitialLoad } = storeToRefs(loadingStore)

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
