<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";

import api from "../api/axios";
import LessonSidebar from "../components/LessonSidebar.vue";
import { useCourseStore } from "../stores/courseStore";

const route = useRoute();
const store = useCourseStore();

const lesson = ref(null);
const contents = ref([]);
const task = ref(null);
const userCode = ref("");

const isTesting = ref(false);
const testResult = ref(null);

const loadLesson = async () => {
  lesson.value = null;
  contents.value = [];
  task.value = null;
  userCode.value = "";
  testResult.value = null;

  try {
    const lessonRes = await api.get(`/lesson/${route.params.id}`);
    lesson.value = lessonRes.data;

    if (lesson.value.course_id) {
      await store.fetchLessons(lesson.value.course_id);
    }

    const contentRes = await api.get(`/lesson/${route.params.id}/content`);
    contents.value = contentRes.data;

    if (lesson.value.content_type === "task" || lesson.value.content_type_id == 3) {
      const taskRes = await api.get(`/task/lesson/${route.params.id}`);
      task.value = taskRes.data;
      userCode.value = task.value?.starter_code || "";
    }
  } catch (e) {
    console.error("Ошибка при загрузке данных урока:", e);
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadLesson();
    }
  },
);

const embedUrl = computed(() => {
  if (!contents.value.length) return "";
  const url = contents.value[0].content;
  if (!url) return "";

  try {
    let videoId = "";
    if (url.includes("watch?v=")) {
      const params = new URL(url).searchParams;
      videoId = params.get("v");
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("embed/")) {
      return url;
    }
    if (!videoId) return "";
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
});

const submitTask = async () => {
  if (!userCode.value.trim()) return alert("Напишите код перед отправкой!");

  isTesting.value = true;
  testResult.value = null;

  try {
    const res = await api.post("/submit", {
      task_id: task.value.id,
      code: userCode.value,
    });

    testResult.value = res.data;
  } catch (e) {
    alert(e.response?.data?.message || "Ошибка сервера при проверке кода.");
  } finally {
    isTesting.value = false;
  }
};

onMounted(() => {
  loadLesson();
});
</script>

<template>
  <div class="flex">
    <LessonSidebar :lessons="store.lessons" />

    <div class="flex-1 p-10 bg-gray-100 min-h-screen">
      <div v-if="!lesson" class="text-gray-500 text-lg">Загрузка материалов урока...</div>

      <div v-else>
        <div v-if="lesson.content_type === 'text' || lesson.content_type_id == 1">
          <div
            v-for="content in contents"
            :key="content.id"
            class="bg-white p-10 rounded-2xl shadow mb-6"
          >
            <h1 class="text-4xl font-bold mb-8">
              {{ lesson.title }}
            </h1>
            <div class="text-lg leading-9 whitespace-pre-line">
              {{ content.content }}
            </div>
          </div>
        </div>

        <div v-if="lesson.content_type === 'video' || lesson.content_type_id == 2">
          <div class="bg-white p-10 rounded-2xl shadow">
            <h1 class="text-4xl font-bold mb-8">
              {{ lesson.title }}
            </h1>

            <iframe
              v-if="embedUrl"
              class="w-full h-[600px] rounded-2xl"
              :src="embedUrl"
              frameborder="0"
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
              "
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div v-if="lesson.content_type === 'task' || lesson.content_type_id == 3">
          <div v-if="task" class="bg-white p-10 rounded-2xl shadow">
            <h1 class="text-4xl font-bold mb-8">
              {{ lesson.title }}
            </h1>

            <h2 class="text-2xl font-bold mb-5">Условие задачи</h2>
            <p class="whitespace-pre-line text-lg mb-10">
              {{ task.description }}
            </p>

            <h2 class="text-2xl font-bold mb-5">Ваш код</h2>
            <textarea
              v-model="userCode"
              class="w-full h-[450px] bg-[#0d1117] text-green-400 p-6 rounded-2xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              :disabled="isTesting"
            ></textarea>

            <div
              v-if="testResult"
              class="mt-8 p-6 rounded-2xl border"
              :class="
                testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              "
            >
              <h3
                class="text-xl font-bold mb-2"
                :class="testResult.success ? 'text-green-700' : 'text-red-700'"
              >
                {{ testResult.message }}
              </h3>

              <pre
                v-if="testResult.errorDetails"
                class="mt-4 p-4 bg-black text-red-400 rounded-xl overflow-x-auto text-sm"
                >{{ testResult.errorDetails }}</pre
              >

              <div
                v-if="!testResult.success && testResult.expected"
                class="mt-4 flex flex-col gap-3 text-sm text-gray-800"
              >
                <div>
                  <span class="font-bold text-gray-500">Входные данные (Input):</span>
                  <div class="bg-white p-3 rounded mt-1 shadow-sm">{{ testResult.input }}</div>
                </div>
                <div>
                  <span class="font-bold text-gray-500">Ожидаемый результат (Expected):</span>
                  <div class="bg-white p-3 rounded mt-1 shadow-sm">{{ testResult.expected }}</div>
                </div>
                <div>
                  <span class="font-bold text-gray-500">Ваш результат (Actual):</span>
                  <div class="bg-white p-3 rounded mt-1 shadow-sm">{{ testResult.actual }}</div>
                </div>
              </div>
            </div>

            <button
              @click="submitTask"
              :disabled="isTesting"
              class="mt-6 transition text-white px-8 py-4 rounded-2xl font-bold"
              :class="
                isTesting ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              "
            >
              {{ isTesting ? "Тестируем..." : "Проверить решение" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
