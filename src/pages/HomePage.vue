<script setup>
import { ref, computed, onMounted } from "vue";
import Sidebar from "../components/Sidebar.vue";
import CourseCard from "../components/CourseCard.vue";
import { useCourseStore } from "../stores/courseStore";
import api from "../api/axios";

const store = useCourseStore();

const searchQuery = ref("");
const selectedLanguage = ref("all");
const languages = ref([]);

const loadLanguages = async () => {
  try {
    const res = await api.get("/languages");
    languages.value = res.data;
  } catch (e) {
    console.error("Ошибка при загрузке языков для фильтра", e);
  }
};

const filteredCourses = computed(() => {
  if (!store.courses || !Array.isArray(store.courses)) return [];

  return store.courses.filter((course) => {
    const title = course.title || "";
    const search = searchQuery.value || "";
    const matchSearch = title.toLowerCase().includes(search.toLowerCase());

    let matchLanguage = true;

    if (selectedLanguage.value !== "all") {
      const targetLangId = Number(selectedLanguage.value);

      const isIdMatch = Number(course.language_id) === targetLangId;

      const langObj = languages.value.find((l) => Number(l.id) === targetLangId);
      const langText = langObj ? langObj.title || langObj.name : "";

      const isNameMatch =
        langText &&
        (course.language_name === langText ||
          course.language_title === langText ||
          course.language === langText);

      matchLanguage = isIdMatch || isNameMatch;
    }

    return matchSearch && matchLanguage;
  });
});

const resetFilters = () => {
  searchQuery.value = "";
  selectedLanguage.value = "all";
};

onMounted(async () => {
  await store.fetchCourses();
  await loadLanguages();
  await store.fetchFavorites();
  await store.fetchSubscriptions();
});
</script>

<template>
  <div class="flex bg-gray-100 min-h-screen">
    <Sidebar />

    <main class="flex-1 p-10">
      <h1 class="text-4xl font-bold mb-8 text-gray-900">Каталог курсов</h1>

      <div class="bg-white p-6 rounded-2xl shadow-sm mb-10 flex gap-4 items-center">
        <div class="flex-1 relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"
          >
            🔍
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Искать курс по названию..."
            class="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent block pl-12 p-4 transition"
          />
        </div>

        <div class="w-72">
          <select
            v-model="selectedLanguage"
            class="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent block p-4 cursor-pointer transition appearance-none"
          >
            <option value="all">Все языки программирования</option>
            <option v-for="lang in languages" :key="lang.id" :value="lang.id">
              {{ lang.title || lang.name || "Без названия" }}
            </option>
          </select>
        </div>
      </div>

      <div
        v-if="filteredCourses.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <CourseCard v-for="course in filteredCourses" :key="course.id" :course="course" />
      </div>

      <div v-else class="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
        <span class="text-6xl mb-6 block">🧐</span>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Ничего не найдено</h3>
        <p class="text-gray-500 mb-6">
          По вашему запросу нет курсов. Попробуйте изменить параметры поиска.
        </p>
        <button
          @click="resetFilters"
          class="bg-purple-100 text-purple-700 hover:bg-purple-200 px-6 py-3 rounded-xl font-medium transition"
        >
          Сбросить фильтры
        </button>
      </div>
    </main>
  </div>
</template>
