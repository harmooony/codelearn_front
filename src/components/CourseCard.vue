<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useCourseStore } from "../stores/courseStore";

const props = defineProps({
  course: Object,
});

const authStore = useAuthStore();
const courseStore = useCourseStore();

const isAuth = computed(() => !!authStore.token);

const isFavorite = computed(() => courseStore.favoriteIds.includes(Number(props.course.id)));
const isSubscribed = computed(() => courseStore.subscriptionIds.includes(Number(props.course.id)));

const handleFavoriteToggle = async () => {
  if (!isAuth.value) return alert("Войдите, чтобы добавлять в избранное");
  await courseStore.toggleFavorite(props.course.id);
};

const handleSubscriptionToggle = async () => {
  if (!isAuth.value) return alert("Войдите, чтобы подписаться на курс");
  await courseStore.toggleSubscription(props.course.id);
};
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow p-5 border hover:scale-105 transition flex flex-col justify-between relative"
  >
    <div>
      <div class="flex justify-between items-start mb-3 gap-2">
        <h2 class="text-2xl font-bold leading-tight">
          {{ course.title }}
        </h2>

        <button
          v-if="isAuth"
          @click="handleFavoriteToggle"
          class="text-2xl transition hover:scale-110 shrink-0"
          :class="isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'"
          title="В избранное"
        >
          {{ isFavorite ? "♥" : "♡" }}
        </button>
      </div>

      <p class="text-gray-500 mb-6 text-sm">
        {{ course.description }}
      </p>
    </div>

    <div class="mt-auto">
      <div class="mb-4 flex justify-between items-center border-t pt-4">
        <span class="text-gray-400 text-sm">Стоимость:</span>
        <span class="font-bold text-purple-600 text-lg"> {{ course.price }} ₽ </span>
      </div>

      <div class="flex flex-col gap-2">
        <button
          v-if="isAuth"
          @click="handleSubscriptionToggle"
          class="w-full py-2.5 rounded-xl text-center font-medium transition text-sm border"
          :class="
            isSubscribed
              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 group'
              : 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700'
          "
        >
          <span v-if="isSubscribed" class="group-hover:hidden">✓ Вы подписаны</span>
          <span v-if="isSubscribed" class="hidden group-hover:inline">Отписаться</span>
          <span v-else>Подписаться</span>
        </button>

        <RouterLink
          :to="`/course/${course.id}`"
          class="w-full bg-black hover:bg-gray-800 text-white text-center py-2.5 rounded-xl text-sm font-medium transition"
        >
          Открыть курс
        </RouterLink>
      </div>
    </div>
  </div>
</template>
