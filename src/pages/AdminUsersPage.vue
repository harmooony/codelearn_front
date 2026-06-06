<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../api/axios";
import Sidebar from "../components/Sidebar.vue";

const users = ref([]);
const searchQuery = ref("");

const newUserForm = ref({
  username: "",
  password: "",
  name: "",
  surname: "",
  email: "",
  phone_number: "",
  role_id: 1,
});

const loadUsers = async () => {
  try {
    const res = await api.get("/user");
    users.value = res.data;
  } catch (e) {
    alert("Ошибка при загрузке пользователей");
  }
};

const createUser = async () => {
  if (!newUserForm.value.username || !newUserForm.value.password || !newUserForm.value.name) {
    return alert("Заполните обязательные поля: Логин, Пароль, Имя");
  }

  try {
    await api.post("/user", newUserForm.value);
    alert("Пользователь успешно создан!");

    newUserForm.value = {
      username: "",
      password: "",
      name: "",
      surname: "",
      email: "",
      phone_number: "",
      role_id: 1,
    };
    await loadUsers();
  } catch (e) {
    alert(e.response?.data?.message || "Ошибка при создании пользователя");
  }
};

const toggleRole = async (user) => {
  const targetRoleId = Number(user.role_id) === 2 ? 1 : 2;
  try {
    await api.put(`/changerole/${user.id}`, { role_id: targetRoleId });
    await loadUsers();
  } catch (e) {
    alert("Не удалось изменить роль пользователя");
  }
};

const deleteUser = async (id) => {
  if (!confirm("Вы уверены, что хотите безвозвратно удалить этого пользователя?")) return;

  try {
    await api.delete(`/user/${id}`);
    await loadUsers();
  } catch (e) {
    alert("Ошибка при удалении пользователя");
  }
};

const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="flex bg-gray-100 min-h-screen">
    <Sidebar />

    <main class="flex-1 p-10">
      <h1 class="text-4xl font-bold mb-10">Управление пользователями</h1>

      <div class="grid grid-cols-3 gap-10 items-start">
        <div class="col-span-2 bg-white p-8 rounded-2xl shadow">
          <h2 class="text-2xl font-bold mb-6">Список аккаунтов</h2>

          <div class="mb-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск пользователя по логину..."
              class="border w-full p-4 rounded-xl focus:outline-purple-500 transition text-sm"
            />
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b text-gray-400 text-sm">
                  <th class="pb-3 font-medium">ID</th>
                  <th class="pb-3 font-medium">Логин</th>
                  <th class="pb-3 font-medium">Имя Фам.</th>
                  <th class="pb-3 font-medium">Роль</th>
                  <th class="pb-3 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="border-b last:border-none hover:bg-gray-50 transition text-sm"
                >
                  <td class="py-4 text-gray-500 font-mono">#{{ user.id }}</td>
                  <td class="py-4 font-bold text-gray-800">{{ user.username }}</td>
                  <td class="py-4 text-gray-600">{{ user.name }} {{ user.surname || "" }}</td>
                  <td class="py-4">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="
                        Number(user.role_id) === 2
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      "
                    >
                      {{ Number(user.role_id) === 2 ? "Администратор" : "Ученик" }}
                    </span>
                  </td>
                  <td class="py-4 text-right flex justify-end gap-2">
                    <button
                      @click="toggleRole(user)"
                      class="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      :class="
                        Number(user.role_id) === 2
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      "
                    >
                      {{ Number(user.role_id) === 2 ? "Разжаловать" : "Дать админку" }}
                    </button>
                    <button
                      @click="deleteUser(user.id)"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="5" class="py-8 text-center text-gray-400">
                    Пользователи не найдены
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow">
          <h2 class="text-2xl font-bold mb-6">Создать аккаунт</h2>

          <div class="flex flex-col gap-4">
            <div>
              <label class="block text-gray-400 mb-1 text-xs">Логин *</label>
              <input
                v-model="newUserForm.username"
                type="text"
                placeholder="username"
                class="border w-full p-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-1 text-xs">Пароль *</label>
              <input
                v-model="newUserForm.password"
                type="password"
                placeholder="••••••••"
                class="border w-full p-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-1 text-xs">Имя *</label>
              <input
                v-model="newUserForm.name"
                type="text"
                placeholder="Иван"
                class="border w-full p-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-1 text-xs">Фамилия</label>
              <input
                v-model="newUserForm.surname"
                type="text"
                placeholder="Иванов"
                class="border w-full p-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-1 text-xs">Email</label>
              <input
                v-model="newUserForm.email"
                type="email"
                placeholder="example@mail.com"
                class="border w-full p-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-1 text-xs">Телефон</label>
              <input
                v-model="newUserForm.phone_number"
                type="text"
                placeholder="+7 (999) 000-00-00"
                class="border w-full p-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label class="block text-gray-400 mb-1 text-xs">Роль по умолчанию</label>
              <select
                v-model="newUserForm.role_id"
                class="border w-full p-3 rounded-xl text-sm bg-white"
              >
                <option :value="1">Ученик</option>
                <option :value="2">Администратор</option>
              </select>
            </div>

            <button
              @click="createUser"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-xl transition font-medium mt-2"
            >
              Создать пользователя
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
