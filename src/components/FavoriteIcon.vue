<script setup lang="ts">
import { useFavoriteStore } from "@/stores/favorite-store.ts";
import { ref } from "vue";

const props = defineProps<{ songId: string }>();
const favoriteStore = useFavoriteStore();
const isAnimating = ref(false);


function toggleFavorite(songId: string) {
  if (favoriteStore.favorites.has(songId)) {
    favoriteStore.removeFavorite(songId);
  } else {
    favoriteStore.addFavorite(songId);
    // Trigger the like animation
    startLikeAnimation();
  }
}

function startLikeAnimation() {
  if (isAnimating.value) return;

  isAnimating.value = true;

  // Resets the state after the animation ends
  setTimeout(() => {
    isAnimating.value = false;
  }, 600);
}
</script>

<template>
  <div class="like-container like-heart z-0 me-1" :class="{ 'like-animation': isAnimating }">
    <b v-if="favoriteStore.favorites.has(props.songId)"
       class="iconfont icon-xihuan text-secondary text-danger cursor-pointer"
       @click="toggleFavorite(props.songId)"></b>
    <b v-else
       class="iconfont icon-xihuan1 text-secondary text-danger-hover cursor-pointer"
       @click="toggleFavorite(props.songId)"></b>

    <!-- Explosion ring effect -->
    <div v-if="isAnimating" class="explosion-rings">
      <div class="explosion-ring ring-1"></div>
      <div class="explosion-ring ring-2"></div>
      <div class="explosion-ring ring-3"></div>
    </div>
  </div>
</template>

<style scoped>
.like-container {
  display: inline-block;
}

.like-heart {
  transition: all 0.3s ease;
  position: relative;
  transform: scale(1.20003141592653589793238462643383279);
  z-index: 10;
}

/* Heartbeat animation */
.like-animation .like-heart {
  animation: heartBeat 0.6s ease;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.95);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Explosive ring container */
.explosion-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  pointer-events: none;
  z-index: 5;
}

/* Explosion ring effect */
.explosion-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid #ff4444;
  border-radius: 50%;
  opacity: 0;
}

/* Different animations of three rings */
.ring-1 {
  animation: ringExplode1 0.6s ease-out;
}

.ring-2 {
  animation: ringExplode2 0.6s ease-out;
  border-color:#ff6b6b;
}

.ring-3 {
  animation: ringExplode3 0.6s ease-out;
  border-color:#ff8e8e;
}

@keyframes ringExplode1 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
    border-width: 3px;
  }
  50% {
    opacity: 0.4;
    border-width: 2px;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
    border-width: 1px;
  }
}

@keyframes ringExplode2 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.7;
    border-width: 2px;
  }
  50% {
    opacity: 0.3;
    border-width: 1.5px;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
    border-width: 0.5px;
  }
}

@keyframes ringExplode3 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.6;
    border-width: 1.5px;
  }
  50% {
    opacity: 0.2;
    border-width: 1px;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
    border-width: 0.5px;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .explosion-rings {
    width: 40px;
    height: 40px;
  }
}
</style>