<script setup lang="ts">
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
defineProps({
  skeletonCount: {
    type: Number,
    default: DEFAULT_PAGE_SIZE
  }
})
</script>

<template>
  <div class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 g-2">
    <div v-for="i in skeletonCount" :key="i">
      <div class="card h-100">
        <!-- Picture area skeleton -->
        <div class="card-img-top ratio ratio-16x9 placeholder-wave">
          <div class="placeholder w-100 h-100 bg-secondary-subtle"></div>
        </div>

        <!-- Content area skeleton -->
        <div class="card-body" >
          <h6 class="card-title placeholder-glow">
            <span class="placeholder col-8 bg-secondary-subtle"></span>
          </h6>
          <p class="card-text placeholder-glow">
            <small class="text-muted d-block">
              <span class="placeholder col-6 bg-secondary-subtle"></span>
            </small>
          </p>
          <p class="card-text placeholder-glow">
            <small class="text-muted d-block">
              <span class="placeholder col-10 bg-secondary-subtle"></span>
              <span class="placeholder col-12 bg-secondary-subtle"></span>
            </small>
          </p>
          <p class="card-text placeholder-glow">
            <small class="text-muted d-block">
              <span class="placeholder col-4 bg-secondary-subtle"></span>
            </small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>