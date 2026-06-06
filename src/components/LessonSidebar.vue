<script setup>
defineProps({
  lessons: Array,
});
</script>

<template>
  <div class="w-72 bg-[#0d1117] text-white p-5 min-h-screen">
    <RouterLink
      to="/"
      class="block mb-6 bg-purple-600 text-white text-center py-3 rounded-xl hover:bg-purple-700 transition"
    >
      ← На главную
    </RouterLink>

    <h2 class="text-xl font-bold mb-6">Уроки</h2>

    <div class="flex flex-col gap-3">
      <RouterLink
        v-for="lesson in lessons"
        :key="lesson.id"
        :to="`/lesson/${lesson.id}`"
        class="bg-[#161b22] p-4 rounded-xl hover:bg-purple-600 transition"
      >
        {{ lesson.order_number }}. {{ lesson.title }}
      </RouterLink>
    </div>
  </div>
</template>
