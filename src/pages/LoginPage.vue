<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/authStore";

const router = useRouter();

const authStore = useAuthStore();

const form = ref({
  username: "",
  password: "",
});

const login = async () => {
  try {
    await authStore.login(form.value);

    router.push("/");
  } catch (e) {
    alert("Login error");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-10 rounded-2xl shadow w-[400px]">
      <h1 class="text-3xl font-bold mb-8 text-center">Логин</h1>

      <div class="flex flex-col gap-5">
        <input v-model="form.username" placeholder="Логин" class="border p-4 rounded-xl" />

        <input
          v-model="form.password"
          type="password"
          placeholder="Пароль"
          class="border p-4 rounded-xl"
        />

        <button @click="login" class="bg-purple-600 text-white p-4 rounded-xl">Войти</button>

        <RouterLink to="/register" class="text-center text-purple-600"> Регистрация </RouterLink>
      </div>
    </div>
  </div>
</template>
