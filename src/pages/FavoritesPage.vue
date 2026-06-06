<script setup>
import { onMounted, computed } from "vue";
import Sidebar from "../components/Sidebar.vue";
import CourseCard from "../components/CourseCard.vue";
import { useCourseStore } from "../stores/courseStore";

const store = useCourseStore();

const favoriteCourses = computed(() => {
  return store.courses.filter((course) => store.favoriteIds.includes(Number(course.id)));
});

onMounted(async () => {
  await store.fetchCourses();
  await store.fetchFavorites();
});
</script>

<template>
  <div class="flex bg-gray-100 min-h-screen">
    <Sidebar />

    <main class="flex-1 p-10">
      <div class="flex items-center gap-4 mb-10">
        <h1 class="text-4xl font-bold text-gray-900">Избранные курсы</h1>
        <span
          v-if="favoriteCourses.length > 0"
          class="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-lg font-bold shadow-sm"
        >
          {{ favoriteCourses.length }}
        </span>
      </div>

      <div
        v-if="favoriteCourses.length === 0"
        class="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <span class="text-6xl mb-6 block">❤️</span>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Здесь пока пусто</h3>
        <p class="text-gray-500 mb-8">
          Нажмите на сердечко на карточке курса, чтобы добавить его сюда и не потерять.
        </p>
        <RouterLink
          to="/"
          class="bg-purple-100 text-purple-700 hover:bg-purple-200 px-8 py-3 rounded-xl font-medium transition"
        >
          Перейти в каталог
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CourseCard v-for="course in favoriteCourses" :key="course.id" :course="course" />
      </div>
    </main>
  </div>
</template>
