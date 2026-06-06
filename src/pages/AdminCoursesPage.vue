<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../api/axios";
import Sidebar from "../components/Sidebar.vue";

const courses = ref([]);
const languages = ref([]);
const searchQuery = ref("");

const toast = ref({ show: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
};

const newCourseForm = ref({
  title: "",
  description: "",
  price: 0,
  language_id: null,
});

const loadCourses = async () => {
  try {
    const res = await api.get("/courses");
    courses.value = res.data;
  } catch (e) {
    showToast("Ошибка при загрузке курсов", "error");
  }
};

const loadLanguages = async () => {
  try {
    const res = await api.get("/languages");
    languages.value = res.data;
    if (languages.value.length > 0) {
      newCourseForm.value.language_id = languages.value[0].id;
    }
  } catch (e) {
    console.error("Не удалось загрузить языки", e);
  }
};

const createCourse = async () => {
  if (!newCourseForm.value.title || !newCourseForm.value.language_id) {
    return showToast("Заполните обязательные поля: Название и Язык", "error");
  }

  const payload = {
    ...newCourseForm.value,
    price: Number(newCourseForm.value.price) || 0,
    language_id: Number(newCourseForm.value.language_id),
  };

  try {
    await api.post("/course", payload);
    showToast("Курс успешно создан!", "success");

    newCourseForm.value = {
      title: "",
      description: "",
      price: 0,
      language_id: languages.value.length > 0 ? languages.value[0].id : null,
    };

    await loadCourses();
  } catch (e) {
    showToast(e.response?.data?.message || "Ошибка при создании курса", "error");
  }
};

const deleteCourse = async (id) => {
  if (
    !confirm(
      "Вы уверены? Это действие безвозвратно удалит сам курс, ВСЕ его уроки, задачи, тесты и подписки пользователей!",
    )
  ) {
    return;
  }

  try {
    await api.delete(`/course/${id}`);
    await loadCourses();
    showToast("Курс и все его материалы успешно удалены.", "success");
  } catch (e) {
    showToast(e.response?.data?.message || "Ошибка при удалении курса", "error");
  }
};

const filteredCourses = computed(() => {
  return courses.value.filter((course) =>
    course.title?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const stats = computed(() => {
  const total = courses.value.length;
  const priceSum = courses.value.reduce((sum, c) => sum + Number(c.price || 0), 0);

  const langCounts = {};
  let topLang = "—";
  let max = 0;

  courses.value.forEach((c) => {
    const l = c.language_name || c.language_title || c.language || "Не указан";
    if (l !== "Не указан") {
      langCounts[l] = (langCounts[l] || 0) + 1;
      if (langCounts[l] > max) {
        max = langCounts[l];
        topLang = l;
      }
    }
  });

  return { total, priceSum, topLang };
});

onMounted(() => {
  loadCourses();
  loadLanguages();
});
</script>

<template>
  <div class="flex bg-gray-100 min-h-screen relative overflow-hidden">
    <Sidebar />

    <main class="flex-1 p-10">
      <h1 class="text-4xl font-bold mb-10">Управление курсами</h1>

      <div class="grid grid-cols-3 gap-6 mb-10">
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500">
          <p class="text-gray-500 text-sm mb-1">Всего курсов</p>
          <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
          <p class="text-gray-500 text-sm mb-1">Общая стоимость базы</p>
          <p class="text-3xl font-bold text-gray-900">{{ stats.priceSum }} ₽</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
          <p class="text-gray-500 text-sm mb-1">Топ язык программирования</p>
          <p class="text-3xl font-bold text-gray-900">{{ stats.topLang }}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-10 items-start">
        <div class="col-span-2 bg-white p-8 rounded-2xl shadow">
          <h2 class="text-2xl font-bold mb-6">Список курсов</h2>

          <div class="mb-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск курса по названию..."
              class="border w-full p-4 rounded-xl focus:outline-purple-500 transition text-sm"
            />
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b text-gray-400 text-sm">
                  <th class="pb-3 font-medium">ID</th>
                  <th class="pb-3 font-medium">Название</th>
                  <th class="pb-3 font-medium">Язык</th>
                  <th class="pb-3 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="course in filteredCourses"
                  :key="course.id"
                  class="border-b last:border-none hover:bg-gray-50 transition text-sm"
                >
                  <td class="py-4 text-gray-500 font-mono">#{{ course.id }}</td>
                  <td class="py-4 font-bold text-gray-800">{{ course.title }}</td>
                  <td class="py-4 text-gray-600">
                    {{
                      course.language_name ||
                      course.language_title ||
                      course.language ||
                      "Не указан"
                    }}
                  </td>
                  <td class="py-4 text-right flex justify-end gap-2">
                    <RouterLink
                      :to="`/manage-course/${course.id}`"
                      class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      Редактировать
                    </RouterLink>
                    <button
                      @click="deleteCourse(course.id)"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredCourses.length === 0">
                  <td colspan="4" class="py-8 text-center text-gray-400">Курсы не найдены</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow">
          <h2 class="text-2xl font-bold mb-6">Создать курс</h2>

          <div class="flex flex-col gap-4">
            <div>
              <label class="block text-gray-400 mb-1 text-xs">Название *</label>
              <input
                v-model="newCourseForm.title"
                type="text"
                placeholder="Например: Основы Python"
                class="border w-full p-3 rounded-xl text-sm focus:outline-purple-500 transition"
              />
            </div>

            <div>
              <label class="block text-gray-400 mb-1 text-xs">Описание</label>
              <textarea
                v-model="newCourseForm.description"
                placeholder="О чем этот курс?"
                class="border w-full p-3 rounded-xl text-sm h-24 focus:outline-purple-500 transition"
              ></textarea>
            </div>

            <div>
              <label class="block text-gray-400 mb-1 text-xs">Язык программирования *</label>
              <select
                v-model="newCourseForm.language_id"
                class="border w-full p-3 rounded-xl text-sm bg-white focus:outline-purple-500 transition text-black"
              >
                <option v-for="lang in languages" :key="lang.id" :value="lang.id">
                  {{ lang.title || lang.name || lang.language_name || "Без названия" }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-gray-400 mb-1 text-xs">Цена (0 = бесплатно)</label>
              <input
                v-model="newCourseForm.price"
                type="number"
                class="border w-full p-3 rounded-xl text-sm focus:outline-purple-500 transition"
              />
            </div>

            <button
              @click="createCourse"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-xl transition font-medium mt-2"
            >
              Создать курс
            </button>
          </div>
        </div>
      </div>
    </main>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-10 opacity-0"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-10 right-10 px-6 py-4 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 z-50',
          toast.type === 'success' ? 'bg-gray-800' : 'bg-red-500',
        ]"
      >
        <span class="text-xl">{{ toast.type === "success" ? "✅" : "❌" }}</span>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>
