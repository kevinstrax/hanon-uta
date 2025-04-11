<script setup lang="ts">
import type { Song } from '@/types/song'
import { onMounted, ref } from 'vue'
import { loadSongs } from '@/utils/loadSongs';
import HelloWorld from './HelloWorld.vue'

const songs = ref<Song[]>([]);
onMounted(async () => {
  songs.value = await loadSongs('hanon');
});
</script>

<template>
  <HelloWorld :songs="songs" />
</template>

<style scoped>

</style>