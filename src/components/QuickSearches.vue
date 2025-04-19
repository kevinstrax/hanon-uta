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
    <p class="quick-searches">クイック検索:
      <template v-for="(item, _) in quickSearches" :key="item.query">
        <a
            :href="`${baseUrl}?search=${encodeURIComponent(item.query)}`"
            class="text-nowrap"
        >
          {{ item.text }}
        </a>
      </template>
    </p>
  </footer>
</template>

<style scoped>
.quick-searches a:not(:last-child)::after {
  content: "|";
  color: var(--bs-secondary);
  margin: 0 0.44rem;
}
</style>