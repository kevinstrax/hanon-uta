<script lang="ts" setup>

import { logout, signIn } from "@/utils/googleAuth.ts";
import { useAuthStore } from "@/stores/auth-store.ts";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { getGoogleUserInfo } from "@/utils/googleUser.ts";
import type { GoogleUserInfo } from "@/types/google-user";
import { useStorageStore } from "@/stores/storage-store.ts";
import { showToast } from "@/utils/updateToast.ts";

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);

const userInfo = ref<GoogleUserInfo | null>(null);

// After logging in successfully, the user information is pulled
async function loadUser() {
  try {
    if (!isLoggedIn?.value) {
      return;
    }

    userInfo.value = authStore.userInfo;
    if (userInfo.value) {
      return;
    }

    getGoogleUserInfo().then((googleUserInfo) => {
      authStore.setUserInfo(googleUserInfo);
      userInfo.value = authStore.userInfo;
    })
  } catch (err) {
    console.error(err);
  }
}

// Click the logout button
function handleLogout() {
  logout();
  window.location.reload();
}

async function syncFavorites(toast: boolean) {
  await useStorageStore().loadFavorites().then(() => {
    toast && showToast()
  })
}

// Listen for changes in login status
watch(isLoggedIn, async (val) => {
  if (val) {
    await loadUser();
    await syncFavorites(false);
  } else {
    authStore.clearUserInfo();
    userInfo.value = null;
  }
});

// Attempt to pull user information when the page refreshes
onMounted(async () => {
  isLoggedIn?.value && loadUser()
});

</script>

<template>
  <li v-if="!isLoggedIn" class="dropdown-item cursor-pointer" @click="signIn()">
    ログイン
  </li>
  <template v-else>
    <li v-if="userInfo" class="dropdown-item cursor-pointer" @click="syncFavorites()">
      <img :alt="userInfo.name" :src="userInfo.picture" class="img-fluid rounded-circle user-picture me-2"/>
      <span class="align-middle">{{ userInfo.name }}</span>
    </li>
    <li class="dropdown-item cursor-pointer" @click="handleLogout()">
      <span>ログアウト</span>
    </li>
  </template>
  <li><hr class="dropdown-divider"></li>
</template>

<style scoped>
.user-picture {
  max-width: 20px;
}
</style>