<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";
import { useCourseStore } from "./stores/courseStore";

const authStore = useAuthStore();
const courseStore = useCourseStore();

onMounted(async () => {
  await authStore.checkAuth();

  if (authStore.token) {
    await courseStore.fetchFavorites();
    await courseStore.fetchSubscriptions();
  }
});
</script>

<template>
  <RouterView />
</template>
