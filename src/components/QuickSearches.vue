<script setup lang="ts">
const quickSearches = [
  { text: "RouteHeart", query: "RouteHeart" },
  { text: "アイドル 歌ってみた", query: "アイドル" },
  { text: "世界一可愛い私 香鳴ハノン", query: "世界一可愛い私" },
  // You can keep adding more
];

const baseUrl = import.meta.env.BASE_URL; // get the base path
</script>
<template>
  <footer class="mb-4">
    <p class="d-flex flex-wrap gap-2">クイック検索:
      <template v-for="(item, idx) in quickSearches" :key="item.query">
        <a
            :href="`${baseUrl}?search=${encodeURIComponent(item.query)}`"

        >
          {{ item.text }}
        </a>
        <span class="text-secondary" v-if="idx != quickSearches.length - 1">|</span>
      </template>
    </p>

    © 2025 Hanon Uta · <a href="/privacy.html" target="_blank">Privacy Policy</a>
  </footer>
</template>

<style scoped>

</style>