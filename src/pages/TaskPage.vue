<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import api from "../api/axios";

const route = useRoute();

const task = ref(null);

onMounted(async () => {
  const res = await api.get(`/lesson/${route.params.id}/tasks`);

  task.value = res.data[0];
});
</script>

<template>
  <div class="p-10 bg-gray-100 min-h-screen">
    <div v-if="task">
      <h1 class="text-3xl font-bold mb-6">Практика</h1>

      <div class="bg-white p-8 rounded-2xl shadow">
        <h2 class="text-2xl font-bold mb-5">
          {{ task.description }}
        </h2>

        <textarea class="w-full h-96 bg-black text-green-400 p-5 rounded-xl"
          >{{ task.starter_code }}
            </textarea
        >

        <button class="mt-5 bg-purple-600 text-white px-6 py-3 rounded-xl">
          Отправить решение
        </button>
      </div>
    </div>
  </div>
</template>
