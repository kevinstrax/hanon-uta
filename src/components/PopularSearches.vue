<script setup lang="ts">
const popularSearches = [
  { text: "世界一可愛い私 香鳴ハノン", query: "世界一可愛い私" },
  { text: "アイドル 歌ってみた", query: "アイドル" },
  { text: "夜に駆ける", query: "夜に駆ける" }
  // You can keep adding more
];

const baseUrl = import.meta.env.BASE_URL; // get the base path
</script>
<template>
  <footer>
    <p class="popular-searches">人気検索:
      <template v-for="(item, _) in popularSearches" :key="item.query">
        <a
            :href="`${baseUrl}#/?search=${encodeURIComponent(item.query)}`"
            class="text-nowrap"
        >
          {{ item.text }}
        </a>
      </template>
    </p>
  </footer>
</template>

<style scoped>
.popular-searches a:not(:last-child)::after {
  content: "|";
  color: var(--bs-secondary);
  margin: 0 0.44rem;
}
</style>