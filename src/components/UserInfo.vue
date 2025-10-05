<script lang="ts" setup>

import { logout, signIn } from "@/utils/googleAuth.ts";
import { useAuthStore } from "@/stores/auth-store.ts";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { getGoogleUserInfo } from "@/utils/googleUser.ts";
import type { GoogleUserInfo } from "@/types/google-user";

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);

const userInfo = ref<GoogleUserInfo | null>(null);

// After logging in successfully, the user information is pulled
async function loadUser() {
  try {
    if (!isLoggedIn?.value) {
      return;
    }
    if (!authStore.userInfo) {
      authStore.setUserInfo(await getGoogleUserInfo());
    }
    userInfo.value = authStore.userInfo;
  } catch (err) {
    console.error(err);
  }
}

// Click the logout button
function handleLogout() {
  logout();
}

// Listen for changes in login status
watch(isLoggedIn, async (val) => {
  if (val) {
    await loadUser();
  } else {
    authStore.clearUserInfo();
    userInfo.value = null;
  }
});

// Attempt to pull user information when the page refreshes
onMounted(async () => {
  if (isLoggedIn?.value) {
    loadUser().then();
  }
});

</script>

<template>
  <li v-if="!isLoggedIn" class="dropdown-item cursor-pointer" @click="signIn()">
    ログイン
  </li>
  <template v-else>
    <li v-if="userInfo" class="dropdown-item cursor-pointer">
      <img :alt="userInfo.name" :src="userInfo.picture || '/favicon.png'" class="img-fluid rounded-circle user-picture me-2"/>
      <span class="align-middle">{{ userInfo.name }}</span>
    </li>
    <li class="dropdown-item cursor-pointer" @click="handleLogout()">
      <span>ログアウト</span>
    </li>
  </template>
</template>

<style scoped>
.user-picture {
  max-width: 20px;
}
</style>