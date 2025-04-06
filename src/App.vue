<script setup lang="ts">
import {onMounted, ref} from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import {loadSongs, loadVideos} from '@/utils/loadSongs';
import type { Song } from '@/types/song'

const songs = ref<Song[]>([]);
onMounted(async () => {
  songs.value = await loadSongs(await loadVideos());
});

</script>

<template>
  <HelloWorld :songs="songs" />
</template>

<style scoped>
</style>
