<script lang="ts" setup>

import { logout, signIn } from "@/utils/googleAuth.ts";
import { useAuthStore } from "@/stores/auth-store.ts";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { getGoogleUserInfo } from "@/utils/googleUser.ts";

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);

const userInfo = ref<{ name?: string; picture?: string } | null>(null);

// After logging in successfully, the user information is pulled
async function loadUser() {
  try {
    if (!isLoggedIn.value) return;
    userInfo.value = await getGoogleUserInfo();
  } catch (err) {
    console.error(err);
  }
}

// Click the Login button
async function handleSignIn() {
  try {
    await signIn();
    // Pull user information after logging in
    await loadUser();
  } catch (err) {
    console.error(err);
  }
}

// Click the logout button
function handleLogout() {
  logout();
  userInfo.value = null;
}

// Listen for changes in login status
watch(isLoggedIn, async (val) => {
  if (val) {
    await loadUser();
  } else {
    userInfo.value = null;
  }
});

// Attempt to pull user information when the page refreshes
onMounted(async () => {
  if (isLoggedIn.value) {
    await loadUser();
  }
});

</script>

<template>
  <li v-if="!isLoggedIn" class="dropdown-item cursor-pointer" @click="handleSignIn()">
    ログイン
  </li>
  <template v-else>
    <li v-if="userInfo" class="dropdown-item cursor-pointer">
      <img :alt="userInfo.name" :src="userInfo.picture" class="img-fluid rounded-circle user-picture me-1"/>
      <span class="align-middle">@{{ userInfo.name }}</span>
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