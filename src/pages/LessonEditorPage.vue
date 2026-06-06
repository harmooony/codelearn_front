<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axios";

const route = useRoute();

const lesson = ref(null);
const textContent = ref("");
const videoUrl = ref("");

const taskForm = ref({
  description: "",
  starter_code: "",
  solution_code: "",
  language: "python3",
});

const testForm = ref({
  input_data: "",
  expected_output: "",
  is_hidden: true,
});

const tests = ref([]);

const loadLesson = async () => {
  const res = await api.get(`/lesson/${route.params.id}`);
  lesson.value = res.data;

  if (lesson.value.content_type_id == 3) {
    try {
      const taskRes = await api.get(`/task/lesson/${lesson.value.id}`);

      if (taskRes.data && taskRes.data.id) {
        lesson.value.task_id = taskRes.data.id;

        taskForm.value = {
          description: taskRes.data.description || "",
          starter_code: taskRes.data.starter_code || "",
          solution_code: taskRes.data.solution_code || "",
          language: taskRes.data.language || "python3",
        };

        await loadTaskTests(lesson.value.task_id);
      }
    } catch (e) {
      console.log("Задача для этого урока еще не создана");
    }
  }
};

const loadTaskTests = async (taskId) => {
  const res = await api.get(`/task/${taskId}/tests`);
  tests.value = res.data;
};

const updateLessonSettings = async () => {
  try {
    await api.put(`/lesson/${lesson.value.id}`, {
      course_id: lesson.value.course_id,
      title: lesson.value.title,
      content_type_id: lesson.value.content_type_id,
      order_number: lesson.value.order_number,
    });

    if (lesson.value.content_type_id == 3) {
      await loadLesson();
    }
  } catch (e) {
    alert("Ошибка при обновлении настроек урока");
  }
};

const saveTextLesson = async () => {
  await api.post("/lesson-content", {
    lesson_id: lesson.value.id,
    content: textContent.value,
    content_type_id: 1,
  });
  alert("Текстовый урок сохранен");
};

const saveVideoLesson = async () => {
  await api.post("/lesson-content", {
    lesson_id: lesson.value.id,
    content: videoUrl.value,
    content_type_id: 2,
  });
  alert("Видео урок сохранен");
};

const saveTask = async () => {
  try {
    if (lesson.value.task_id) {
      await api.put(`/task/${lesson.value.task_id}`, {
        lesson_id: lesson.value.id,
        description: taskForm.value.description,
        starter_code: taskForm.value.starter_code,
        solution_code: taskForm.value.solution_code,
        language: taskForm.value.language,
      });
      alert("Задача успешно обновлена!");
    } else {
      const res = await api.post("/task", {
        lesson_id: lesson.value.id,
        description: taskForm.value.description,
        starter_code: taskForm.value.starter_code,
        solution_code: taskForm.value.solution_code,
        language: taskForm.value.language,
      });

      lesson.value.task_id = res.data.id;
      alert("Задача успешно создана! Теперь вы можете добавить тесты.");
    }
  } catch (e) {
    alert("Ошибка при сохранении задачи");
  }
};

const createTest = async () => {
  try {
    await api.post("/task-test", {
      task_id: lesson.value.task_id,
      input_data: testForm.value.input_data,
      expected_output: testForm.value.expected_output,
      is_hidden: testForm.value.is_hidden,
    });

    testForm.value = {
      input_data: "",
      expected_output: "",
      is_hidden: true,
    };

    await loadTaskTests(lesson.value.task_id);
  } catch (e) {
    alert("Ошибка при добавлении теста");
  }
};

const embedUrl = computed(() => {
  if (!videoUrl.value) return "";
  const id = videoUrl.value.split("v=")[1];
  return `https://www.youtube.com/embed/${id}`;
});

onMounted(async () => {
  await loadLesson();
});
</script>

<template>
  <div class="p-10 bg-gray-100 min-h-screen">
    <RouterLink
      v-if="lesson && lesson.course_id"
      :to="`/manage-course/${lesson.course_id}`"
      class="inline-block mb-8 bg-black text-white px-6 py-3 rounded-xl transition hover:bg-gray-800"
    >
      ← Назад к курсу
    </RouterLink>

    <div v-if="lesson" class="bg-white p-8 rounded-2xl shadow">
      <h1 class="text-4xl font-bold mb-3">
        {{ lesson.title }}
      </h1>

      <p class="text-gray-500 mb-10">Редактор урока</p>

      <div class="mb-10 border-b pb-10">
        <h2 class="text-2xl font-bold mb-5">Тип урока</h2>
        <select
          v-model="lesson.content_type_id"
          @change="updateLessonSettings"
          class="border p-4 rounded-xl w-full focus:outline-purple-500 transition"
        >
          <option :value="1">Текст</option>
          <option :value="2">Видео</option>
          <option :value="3">Задача</option>
        </select>
      </div>

      <div v-if="lesson.content_type_id == 1">
        <h2 class="text-2xl font-bold mb-5">Текст урока</h2>
        <textarea
          v-model="textContent"
          class="w-full h-[300px] border rounded-2xl p-5 focus:outline-purple-500 transition"
          placeholder="Введите текст урока..."
        ></textarea>
        <button
          @click="saveTextLesson"
          class="mt-5 bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-xl font-medium"
        >
          Сохранить текст
        </button>
      </div>

      <div v-if="lesson.content_type_id == 2">
        <h2 class="text-2xl font-bold mb-5">Видео урок</h2>
        <input
          v-model="videoUrl"
          placeholder="YouTube ссылка"
          class="border p-4 rounded-xl w-full mb-5 focus:outline-purple-500 transition"
        />
        <iframe
          v-if="videoUrl"
          class="w-full h-[500px] rounded-2xl"
          :src="embedUrl"
          allowfullscreen
        ></iframe>
        <button
          @click="saveVideoLesson"
          class="mt-5 bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-xl font-medium"
        >
          Сохранить видео
        </button>
      </div>

      <div v-if="lesson.content_type_id == 3">
        <h2 class="text-2xl font-bold mb-5">Условие и код задачи</h2>

        <div class="flex flex-col gap-5">
          <textarea
            v-model="taskForm.description"
            placeholder="Условие задачи (что нужно сделать)"
            class="border rounded-2xl p-5 h-[150px] focus:outline-purple-500 transition"
          ></textarea>
          <textarea
            v-model="taskForm.starter_code"
            placeholder="Начальный код (который увидит студент)"
            class="border rounded-2xl p-5 h-[200px] font-mono bg-[#0d1117] text-green-400 focus:outline-purple-500 transition"
          ></textarea>
          <textarea
            v-model="taskForm.solution_code"
            placeholder="Правильное решение (для себя)"
            class="border rounded-2xl p-5 h-[200px] font-mono bg-[#0d1117] text-green-400 focus:outline-purple-500 transition"
          ></textarea>
          <select
            v-model="taskForm.language"
            class="border p-4 rounded-xl focus:outline-purple-500 transition bg-white w-full cursor-pointer"
          >
            <option value="python3">Python 3</option>
            <option value="nodejs">JavaScript (Node.js)</option>
          </select>

          <button
            @click="saveTask"
            class="bg-purple-600 hover:bg-purple-700 transition text-white py-4 rounded-xl font-medium"
          >
            {{ lesson.task_id ? "Обновить задачу" : "Создать задачу" }}
          </button>
        </div>

        <div v-if="lesson.task_id" class="mt-10 border-t pt-10">
          <h2 class="text-2xl font-bold mb-5">Тесты для JDoodle</h2>

          <div class="flex flex-col gap-4 mb-8 bg-gray-50 p-6 rounded-2xl border">
            <textarea
              v-model="testForm.input_data"
              placeholder="Входные данные (Input data) - то, что пойдет в stdin"
              class="border rounded-xl p-4 focus:outline-purple-500 transition"
            ></textarea>
            <textarea
              v-model="testForm.expected_output"
              placeholder="Ожидаемый вывод (Expected output) - то, что скрипт должен вывести через print()"
              class="border rounded-xl p-4 focus:outline-purple-500 transition"
            ></textarea>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="testForm.is_hidden"
                class="w-5 h-5 accent-purple-600"
              />
              <span class="font-medium text-gray-700">Скрытый тест</span>
            </label>

            <button
              @click="createTest"
              class="bg-black hover:bg-gray-800 transition text-white py-3 rounded-xl font-medium"
            >
              Добавить тест
            </button>
          </div>

          <div class="flex flex-col gap-4">
            <div
              v-for="(test, index) in tests"
              :key="test.id"
              class="bg-white border shadow-sm p-5 rounded-2xl flex flex-col gap-2"
            >
              <div class="font-bold pb-2 border-b">
                Тест #{{ index + 1 }}
                <span v-if="test.is_hidden" class="text-sm font-normal text-red-500 ml-2"
                  >(Скрытый)</span
                >
              </div>
              <div class="text-sm">
                <span class="font-bold text-gray-500 block mb-1">Input (ввод):</span>
                <div class="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                  {{ test.input_data || "Нет входных данных" }}
                </div>
              </div>
              <div class="text-sm">
                <span class="font-bold text-gray-500 block mb-1">Output (ожидаемый вывод):</span>
                <div class="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                  {{ test.expected_output }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
