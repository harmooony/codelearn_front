<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const router = useRouter();

const form = ref({
  username: "",
  password: "",
  name: "",
  surname: "",
});

const errorMsg = ref("");

const register = async () => {
  errorMsg.value = "";

  if (!form.value.username || !form.value.password) {
    errorMsg.value = "Заполните логин и пароль";
    return;
  }

  try {
    await api.post("/user", {
      username: form.value.username,
      password: form.value.password,
      name: form.value.name,
      surname: form.value.surname,
      role_id: 1,
    });

    alert("Регистрация успешна! Теперь вы можете войти.");
    router.push("/login");
  } catch (e) {
    errorMsg.value = e.response?.data?.message || "Ошибка при регистрации";
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Создать аккаунт</h1>
        <p class="text-gray-500">Присоединяйтесь к CodeLearn</p>
      </div>

      <div class="flex flex-col gap-5">
        <div
          v-if="errorMsg"
          class="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium text-center"
        >
          {{ errorMsg }}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-500 mb-1 text-sm font-medium">Имя</label>
            <input
              v-model="form.name"
              type="text"
              class="border w-full p-3 rounded-xl focus:outline-purple-500 transition bg-gray-50"
            />
          </div>
          <div>
            <label class="block text-gray-500 mb-1 text-sm font-medium">Фамилия</label>
            <input
              v-model="form.surname"
              type="text"
              class="border w-full p-3 rounded-xl focus:outline-purple-500 transition bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-500 mb-1 text-sm font-medium">Логин (Username) *</label>
          <input
            v-model="form.username"
            type="text"
            class="border w-full p-3 rounded-xl focus:outline-purple-500 transition bg-gray-50"
          />
        </div>

        <div>
          <label class="block text-gray-500 mb-1 text-sm font-medium">Пароль *</label>
          <input
            v-model="form.password"
            type="password"
            class="border w-full p-3 rounded-xl focus:outline-purple-500 transition bg-gray-50"
          />
        </div>

        <button
          @click="register"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-4 rounded-xl transition font-bold text-lg mt-2 shadow-md"
        >
          Зарегистрироваться
        </button>

        <p class="text-center text-gray-500 text-sm mt-4">
          Уже есть аккаунт?
          <RouterLink to="/login" class="text-purple-600 font-bold hover:underline"
            >Войти</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
