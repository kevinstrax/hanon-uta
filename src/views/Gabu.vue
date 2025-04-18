<script setup lang="ts">
import HelloWorld from '../components/HelloWorld.vue'
import { VTUBERS } from '@/config/constants';
</script>

<template>
  <HelloWorld :vtuber="VTUBERS.SAOTOME_GABU['name']" />
</template>

<style scoped>

</style>