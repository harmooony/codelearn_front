import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import CoursePage from "../pages/CoursePage.vue";
import LessonPage from "../pages/LessonPage.vue";
import TaskPage from "../pages/TaskPage.vue";
import AdminCoursesPage from "../pages/AdminCoursesPage.vue";

import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import MyCoursesPage from "../pages/MyCoursesPage.vue";
import LessonEditorPage from "../pages/LessonEditorPage.vue";

import FavoritesPage from "../pages/FavoritesPage.vue";
import SubscriptionsPage from "../pages/SubscriptionsPage.vue";
import CourseManagePage from "../pages/CourseManagePage.vue";
import AdminUsersPage from "../pages/AdminUsersPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterPage,
  },
  {
    path: "/course/:id",
    component: CoursePage,
  },
  {
    path: "/lesson/:id",
    component: LessonPage,
  },
  {
    path: "/task/:id",
    component: TaskPage,
  },

  // НАШИ НОВЫЕ РОУТЫ
  {
    path: "/favorites",
    component: FavoritesPage,
    beforeEnter: () => {
      if (!localStorage.getItem("token")) return "/login";
    },
  },
  {
    path: "/subscriptions",
    component: SubscriptionsPage,
    beforeEnter: () => {
      if (!localStorage.getItem("token")) return "/login";
    },
  },

  {
    path: "/admin/courses",
    component: AdminCoursesPage,
    beforeEnter: () => {
      const token = localStorage.getItem("token");
      if (!token) return "/login";
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Number(payload.role_id) !== 2) return "/";
    },
  },
  {
    path: "/my-courses",
    component: MyCoursesPage,
    beforeEnter: () => {
      const token = localStorage.getItem("token");
      if (!token) return "/login";
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Number(payload.role_id) !== 2) return "/";
    },
  },
  {
    path: "/lesson-editor/:id",
    component: LessonEditorPage,
  },
  {
    path: "/manage-course/:id",
    component: CourseManagePage,
    beforeEnter: () => {
      const token = localStorage.getItem("token");
      if (!token) return "/login";
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Number(payload.role_id) !== 2) return "/";
    },
  },
  {
    path: "/admin/users",
    component: AdminUsersPage,
    beforeEnter: () => {
      const token = localStorage.getItem("token");
      if (!token) return "/login";
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Number(payload.role_id) !== 2) return "/";
    },
  },
  {
    path: "/profile",
    component: ProfilePage,
    beforeEnter: () => {
      if (!localStorage.getItem("token")) return "/login";
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
