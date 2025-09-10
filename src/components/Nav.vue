<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { VTUBER_KEYS } from "@/config/constants.ts";

const router = useRouter()

const menuRoutes = computed(() => {
  return router.getRoutes()
    .filter(r => !r.meta.disabled)
    .filter(r => VTUBER_KEYS.includes(r.name as string));
})

const currentRouteTitle = computed(() => {
  return (router.currentRoute.value.meta.title || 'ページを選択')
      + (router.currentRoute.value.meta.mark ?? '')
})
</script>

<template>
  <div class="dropdown float-start mt-4 me-2">
    <button
        class="btn btn-light dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
    >
      {{ currentRouteTitle }}
    </button>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
      <li v-for="route in menuRoutes" :key="route.path">
        <router-link
            class="dropdown-item"
            :to="route.path"
        >
          {{ route.meta.title }}{{ route.meta.mark }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>