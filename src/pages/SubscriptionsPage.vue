<script setup>
import { onMounted, computed } from "vue";
import Sidebar from "../components/Sidebar.vue";
import CourseCard from "../components/CourseCard.vue";
import { useCourseStore } from "../stores/courseStore";

const store = useCourseStore();

const subscribedCourses = computed(() => {
  return store.courses.filter((course) => store.subscriptionIds.includes(Number(course.id)));
});

onMounted(async () => {
  await store.fetchCourses();
  await store.fetchSubscriptions();
});
</script>

<template>
  <div class="flex bg-gray-100 min-h-screen">
    <Sidebar />

    <main class="flex-1 p-10">
      <h1 class="text-4xl font-bold mb-10">Мои подписки</h1>

      <div
        v-if="subscribedCourses.length === 0"
        class="text-gray-500 text-lg bg-white p-8 rounded-2xl shadow"
      >
        Вы пока не подписаны ни на один курс. Самое время выбрать что-нибудь интересное на главной!
      </div>

      <div v-else class="grid grid-cols-3 gap-6">
        <CourseCard v-for="course in subscribedCourses" :key="course.id" :course="course" />
      </div>
    </main>
  </div>
</template>
