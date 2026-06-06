import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Токен успешно добавлен в заголовок!");
  } else {
    console.warn("ТОКЕН НЕ НАЙДЕН В LOCALSTORAGE");
  }

  return config;
});

export default api;
