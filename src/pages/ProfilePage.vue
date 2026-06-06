<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../api/axios";
import Sidebar from "../components/Sidebar.vue";
import { useAuthStore } from "../stores/authStore";
import { useCourseStore } from "../stores/courseStore";

const authStore = useAuthStore();
const courseStore = useCourseStore();

const isSaving = ref(false);

const form = ref({
  id: null,
  username: "",
  name: "",
  surname: "",
  email: "",
  phone_number: "",
  role_id: 1,
});

const initForm = () => {
  if (authStore.user) {
    form.value = {
      id: authStore.user.id,
      username: authStore.user.username || "",
      name: authStore.user.name || "",
      surname: authStore.user.surname || "",
      email: authStore.user.email || "",
      phone_number: authStore.user.phone_number || "",
      role_id: authStore.user.role_id,
    };
  }
};

const saveProfile = async () => {
  isSaving.value = true;
  try {
    const res = await api.put("/user", form.value);

    await authStore.checkAuth();
    alert("Профиль успешно обновлен! 🎉");
  } catch (e) {
    alert(e.response?.data?.message || "Ошибка при сохранении профиля");
  } finally {
    isSaving.value = false;
  }
};

const developerRank = computed(() => {
  const subsCount = courseStore.subscriptionIds.length;

  if (subsCount === 0)
    return {
      title: "Noob Developer 🥚",
      color: "text-gray-500",
      desc: "Подпишитесь на первый курс, чтобы начать свой путь!",
    };
  if (subsCount === 1)
    return {
      title: "Junior Developer 🌱",
      color: "text-green-500",
      desc: "Первый шаг сделан. База заложена!",
    };
  if (subsCount >= 2 && subsCount <= 3)
    return {
      title: "Middle Developer 🚀",
      color: "text-purple-500",
      desc: "Уверенно пишете код и изучаете новые технологии!",
    };
  return {
    title: "Senior Architect 👑",
    color: "text-amber-500",
    desc: "Вы монстр кодинга! Время проектировать свои системы.",
  };
});

onMounted(async () => {
  if (authStore.token) {
    await courseStore.fetchSubscriptions();
    await courseStore.fetchFavorites();
  }
  initForm();
});
</script>

<template>
  <div class="flex bg-gray-100 min-h-screen">
    <Sidebar />

    <main class="flex-1 p-10">
      <h1 class="text-4xl font-bold mb-10">Мой профиль</h1>

      <div class="grid grid-cols-3 gap-10 items-start">
        <div class="col-span-2 bg-white p-8 rounded-2xl shadow">
          <h2 class="text-2xl font-bold mb-6 border-b pb-4">Личные данные</h2>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 mb-2 text-xs uppercase font-bold tracking-wider"
                >Логин (ID аккаунта)</label
              >
              <input
                v-model="form.username"
                type="text"
                class="border w-full p-4 rounded-xl text-sm bg-gray-50 text-gray-500 font-mono"
                disabled
              />
            </div>

            <div>
              <label class="block text-gray-400 mb-2 text-xs uppercase font-bold tracking-wider"
                >Email</label
              >
              <input
                v-model="form.email"
                type="email"
                placeholder="example@codelearn.ru"
                class="border w-full p-4 rounded-xl text-sm focus:outline-purple-500 transition"
              />
            </div>

            <div>
              <label class="block text-gray-400 mb-2 text-xs uppercase font-bold tracking-wider"
                >Имя</label
              >
              <input
                v-model="form.name"
                type="text"
                placeholder="Ваше имя"
                class="border w-full p-4 rounded-xl text-sm focus:outline-purple-500 transition"
              />
            </div>

            <div>
              <label class="block text-gray-400 mb-2 text-xs uppercase font-bold tracking-wider"
                >Фамилия</label
              >
              <input
                v-model="form.surname"
                type="text"
                placeholder="Ваша фамилия"
                class="border w-full p-4 rounded-xl text-sm focus:outline-purple-500 transition"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-gray-400 mb-2 text-xs uppercase font-bold tracking-wider"
                >Номер телефона</label
              >
              <input
                v-model="form.phone_number"
                type="text"
                placeholder="+7 (999) 000-00-00"
                class="border w-full p-4 rounded-xl text-sm focus:outline-purple-500 transition"
              />
            </div>
          </div>

          <button
            @click="saveProfile"
            :disabled="isSaving"
            class="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl transition font-medium text-base shadow-md disabled:bg-gray-400"
          >
            {{ isSaving ? "Сохранение..." : "Сохранить изменения" }}
          </button>
        </div>

        <div class="flex flex-col gap-6">
          <div
            class="bg-black text-white p-8 rounded-2xl shadow flex flex-col items-center text-center relative overflow-hidden"
          >
            <div
              class="absolute -right-10 -top-10 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-40"
            ></div>

            <div class="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2">
              Статус разработчика
            </div>
            <div class="text-2xl font-black mb-3" :class="developerRank.color">
              {{ developerRank.title }}
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              {{ developerRank.desc }}
            </p>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow grid grid-cols-2 gap-4">
            <div class="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
              <span class="block text-3xl font-black text-purple-600 mb-1">
                {{ courseStore.subscriptionIds.length }}
              </span>
              <span class="text-xs font-medium text-purple-700 uppercase tracking-wider"
                >Курсов изучается</span
              >
            </div>

            <div class="bg-red-50 p-4 rounded-xl text-center border border-red-100">
              <span class="block text-3xl font-black text-red-500 mb-1">
                {{ courseStore.favoriteIds.length }}
              </span>
              <span class="text-xs font-medium text-red-700 uppercase tracking-wider"
                >В избранном</span
              >
            </div>

            <div
              class="col-span-2 bg-gray-50 p-4 rounded-xl flex justify-between items-center px-5 text-sm"
            >
              <span class="text-gray-500">Роль в системе:</span>
              <span class="font-bold text-gray-800">
                {{ Number(authStore.user?.role_id) === 2 ? "Преподаватель / Админ" : "Студент" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
