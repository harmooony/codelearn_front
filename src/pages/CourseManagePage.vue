<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";

const route = useRoute();
const router = useRouter();

const course = ref(null);
const lessons = ref([]);

const lessonForm = ref({
  course_id: Number(route.params.id),
  title: "",
  content_type_id: 1,
  order_number: 1,
});

const loadCourseData = async () => {
  if (!route.params.id || route.params.id === "undefined") {
    router.push("/my-courses");
    return;
  }

  const courseRes = await api.get(`/course/${route.params.id}`);
  course.value = courseRes.data;

  const lessonsRes = await api.get(`/course/${route.params.id}/lessons`);
  lessons.value = lessonsRes.data;

  if (lessons.value.length > 0) {
    const lastLesson = lessons.value[lessons.value.length - 1];
    lessonForm.value.order_number = Number(lastLesson.order_number) + 1;
  }
};

const createLesson = async () => {
  if (!lessonForm.value.title) return alert("Введите название урока!");

  const res = await api.post("/lesson", lessonForm.value);

  router.push(`/lesson-editor/${res.data.id}`);
};

onMounted(() => {
  loadCourseData();
});
</script>

<template>
  <div class="p-10 min-h-screen bg-gray-100">
    <RouterLink
      to="/my-courses"
      class="inline-block mb-8 bg-black text-white px-6 py-3 rounded-xl transition hover:bg-gray-800"
    >
      ← К моим курсам
    </RouterLink>

    <div v-if="course">
      <h1 class="text-4xl font-bold mb-2">Управление: {{ course.title }}</h1>
      <p class="text-gray-500 mb-10">Здесь вы можете добавлять и редактировать уроки курса.</p>

      <div class="grid grid-cols-2 gap-10">
        <div>
          <h2 class="text-2xl font-bold mb-6">Список уроков</h2>

          <div v-if="lessons.length === 0" class="text-gray-500 bg-white p-6 rounded-2xl shadow">
            Уроков пока нет. Создайте первый!
          </div>

          <div v-else class="flex flex-col gap-3">
            <div
              v-for="lesson in lessons"
              :key="lesson.id"
              class="bg-white p-5 rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <span class="text-gray-400 font-bold mr-2">{{ lesson.order_number }}.</span>
                <span class="font-medium text-lg">{{ lesson.title }}</span>
              </div>

              <RouterLink
                :to="`/lesson-editor/${lesson.id}`"
                class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl transition text-sm"
              >
                Редактировать
              </RouterLink>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold mb-6">Добавить новый урок</h2>

          <div class="bg-white p-8 rounded-2xl shadow flex flex-col gap-5">
            <div>
              <label class="block text-gray-500 mb-2 text-sm">Название урока</label>
              <input
                v-model="lessonForm.title"
                placeholder="Например: Введение в Vue"
                class="border w-full p-4 rounded-xl focus:outline-purple-500 transition"
              />
            </div>

            <div>
              <label class="block text-gray-500 mb-2 text-sm">Тип урока</label>
              <select
                v-model="lessonForm.content_type_id"
                class="border w-full p-4 rounded-xl focus:outline-purple-500 transition"
              >
                <option :value="1">Текст</option>
                <option :value="2">Видео</option>
                <option :value="3">Задача</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-500 mb-2 text-sm">Порядковый номер</label>
              <input
                v-model="lessonForm.order_number"
                type="number"
                class="border w-full p-4 rounded-xl focus:outline-purple-500 transition"
              />
            </div>

            <button
              @click="createLesson"
              class="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl mt-2 transition font-medium text-lg"
            >
              Создать урок
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
