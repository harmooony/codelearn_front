import { defineStore } from "pinia";
import api from "../api/axios";
import { useAuthStore } from "./authStore";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: [],
    lessons: [],
    favoriteIds: [],
    subscriptionIds: [],
  }),

  actions: {
    async fetchCourses() {
      try {
        const res = await api.get("/courses");
        this.courses = res.data;
      } catch (e) {
        console.error("Ошибка при загрузке курсов:", e);
      }
    },

    async fetchLessons(courseId) {
      try {
        const res = await api.get(`/course/${courseId}/lessons`);
        this.lessons = res.data;
      } catch (e) {
        console.error("Ошибка при загрузке уроков для стора:", e);
      }
    },

    async fetchFavorites() {
      const authStore = useAuthStore();
      if (!authStore.token) return;

      const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
      try {
        const res = await api.get("/favorites", config);
        this.favoriteIds = res.data.map((item) =>
          typeof item === "object" ? Number(item.course_id || item.id) : Number(item),
        );
      } catch (e) {
        console.error("Ошибка при получении избранного:", e);
      }
    },

    async fetchSubscriptions() {
      const authStore = useAuthStore();
      if (!authStore.token) return;

      const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
      try {
        const res = await api.get("/subscriptions", config);
        this.subscriptionIds = res.data.map((item) =>
          typeof item === "object" ? Number(item.course_id || item.id) : Number(item),
        );
      } catch (e) {
        console.error("Ошибка при получении подписок:", e);
      }
    },

    async toggleFavorite(courseId) {
      const authStore = useAuthStore();
      if (!authStore.token) return;
      const config = { headers: { Authorization: `Bearer ${authStore.token}` } };

      const idNum = Number(courseId);

      try {
        if (this.favoriteIds.includes(idNum)) {
          await api.delete(`/favorite/${idNum}`, config);
          this.favoriteIds = this.favoriteIds.filter((id) => id !== idNum);
        } else {
          await api.post("/favorite", { course_id: idNum }, config);
          this.favoriteIds.push(idNum);
        }
      } catch (e) {
        console.error("Ошибка при переключении избранного:", e);
        if (e.response?.status === 403) authStore.logout();
      }
    },

    async toggleSubscription(courseId) {
      const authStore = useAuthStore();
      if (!authStore.token) return;
      const config = { headers: { Authorization: `Bearer ${authStore.token}` } };

      const idNum = Number(courseId);

      try {
        if (this.subscriptionIds.includes(idNum)) {
          await api.delete(`/subscription/${idNum}`, config);
          this.subscriptionIds = this.subscriptionIds.filter((id) => id !== idNum);
        } else {
          await api.post("/subscription", { course_id: idNum }, config);
          this.subscriptionIds.push(idNum);
        }
      } catch (e) {
        console.error("Ошибка при изменении подписки:", e);
        if (e.response?.status === 403) authStore.logout();
      }
    },
  },
});
