<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menuRoutes = computed(() => {
  return router.getRoutes();
})

const currentRouteTitle = computed(() => {
  return router.currentRoute.value.meta.title || '选择页面'
})
</script>

<template>
  <div class="dropdown float-start mt-4">
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
          {{ route.meta.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>