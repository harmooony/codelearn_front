<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import LessonSidebar from "../components/LessonSidebar.vue";

import { useCourseStore } from "../stores/courseStore";

const route = useRoute();
const store = useCourseStore();

onMounted(() => {
  store.fetchLessons(route.params.id);
});
</script>

<template>
  <div class="flex">
    <LessonSidebar :lessons="store.lessons" />

    <div class="flex-1 p-10">
      <h1 class="text-4xl font-bold mb-5">Содержание курса</h1>

      <p class="text-gray-500">Выберите урок слева</p>
    </div>
  </div>
</template>
