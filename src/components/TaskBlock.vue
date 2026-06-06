<script setup>
defineProps({
  task: Object,
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow">
    <h2 class="text-2xl font-bold mb-4">Задача</h2>

    <p class="mb-6">
      {{ task.description }}
    </p>

    <pre class="bg-black text-green-400 p-5 rounded-xl overflow-auto"
      >{{ task.starter_code }}
    </pre>
  </div>
</template>
