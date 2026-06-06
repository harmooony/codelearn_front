<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const router = useRouter();

const isAuth = computed(() => !!authStore.token);

const isAdmin = computed(() => {
  return Number(authStore.user?.role_id) === 2;
});

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<template>
  <aside class="w-64 min-h-screen bg-black text-white p-6 flex flex-col justify-between">
    <div>
      <h1 class="text-2xl font-bold mb-10 text-purple-500">CodeLearn</h1>

      <nav class="flex flex-col gap-4">
        <RouterLink to="/" class="hover:text-purple-400 transition"> Главная </RouterLink>

        <RouterLink v-if="isAuth" to="/subscriptions" class="hover:text-purple-400 transition">
          Мои подписки
        </RouterLink>
        <RouterLink v-if="isAuth" to="/favorites" class="hover:text-purple-400 transition">
          Избранное
        </RouterLink>

        <RouterLink v-if="isAdmin" to="/admin/courses" class="hover:text-purple-400 transition">
          Админка
        </RouterLink>
        <RouterLink v-if="isAdmin" to="/admin/users" class="hover:text-purple-400 transition">
          Пользователи
        </RouterLink>
        <RouterLink v-if="isAdmin" to="/my-courses" class="hover:text-purple-400 transition">
          Мои курсы
        </RouterLink>
      </nav>
    </div>

    <div class="border-t border-gray-800 pt-5">
      <div v-if="isAuth">
        <div class="bg-[#161b22] p-4 rounded-2xl">
          <p class="text-sm text-gray-400 mb-1">Вы вошли как</p>

          <h2 class="text-lg font-bold">
            {{ authStore.user?.username }}
          </h2>

          <div class="flex flex-col gap-2 mt-4">
            <RouterLink
              to="/profile"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-xl text-sm font-medium transition"
            >
              ⚙ Настройки профиля
            </RouterLink>

            <button
              @click="handleLogout"
              class="w-full bg-red-500 hover:bg-red-600 transition py-2 rounded-xl text-sm text-white"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-3">
        <RouterLink
          to="/login"
          class="bg-purple-600 hover:bg-purple-700 transition text-center py-3 rounded-xl font-medium"
        >
          Войти
        </RouterLink>

        <RouterLink
          to="/register"
          class="bg-[#161b22] hover:bg-[#222b36] transition text-center py-3 rounded-xl font-medium"
        >
          Регистрация
        </RouterLink>
      </div>
    </div>
  </aside>
</template>
