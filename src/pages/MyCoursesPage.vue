<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const courses = ref([]);

const loadCourses = async () => {
  const res = await api.get(`/courses/creator/${authStore.user.id}`);
  courses.value = res.data;
};

onMounted(() => {
  loadCourses();
});
</script>

<template>
  <div class="p-10 min-h-screen bg-gray-100">
    <RouterLink
      to="/"
      class="inline-block mb-8 bg-black text-white px-6 py-3 rounded-xl transition hover:bg-gray-800"
    >
      ← На главную
    </RouterLink>

    <h1 class="text-4xl font-bold mb-10">Мои курсы</h1>

    <div class="grid grid-cols-3 gap-6">
      <div
        v-for="course in courses"
        :key="course.id"
        class="bg-white p-6 rounded-2xl shadow flex flex-col justify-between"
      >
        <div>
          <h2 class="text-2xl font-bold mb-3 leading-tight">
            {{ course.title }}
          </h2>
          <p class="text-gray-500 mb-5 text-sm">
            {{ course.description }}
          </p>
        </div>

        <div class="mt-auto pt-5 border-t flex flex-col gap-3">
          <RouterLink
            :to="`/manage-course/${course.id}`"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-xl transition font-medium"
          >
            Управление курсом
          </RouterLink>

          <RouterLink
            :to="`/course/${course.id}`"
            class="w-full bg-black hover:bg-gray-800 text-white text-center py-3 rounded-xl transition font-medium"
          >
            Открыть как ученик
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
