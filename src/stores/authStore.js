import { defineStore } from "pinia";

import api from "../api/axios";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null,
  }),

  actions: {
    async register(data) {
      const res = await api.post("/register", data);

      this.token = res.data.token;

      localStorage.setItem("token", res.data.token);

      await this.checkAuth();
    },

    async login(data) {
      const res = await api.post("/login", data);

      this.token = res.data.token;

      localStorage.setItem("token", res.data.token);

      await this.checkAuth();
    },

    logout() {
      this.token = null;

      this.user = null;

      localStorage.removeItem("token");
    },

    async checkAuth() {
      if (!this.token) return;

      const res = await api.get("/auth", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      this.user = res.data;
    },
  },
});
