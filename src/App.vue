<script setup lang="ts">
import {onMounted, ref} from 'vue'
// import HelloWorld from './components/HelloWorld.vue'
import {loadSongs} from '@/utils/loadSongs';
import type { Song } from '@/types/song'
import Nav from "@/components/Nav.vue";

const songs = ref<Song[]>([]);
onMounted(async () => {
  songs.value = await loadSongs('hanon');
});

</script>

<template>
  <Nav />
  <router-view />
</template>

<style scoped>
</style>
