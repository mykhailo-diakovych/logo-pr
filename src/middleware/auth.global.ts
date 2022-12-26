import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

    if (!token && to.fullPath !== "/login" && from.fullPath !== "/login") {
      return navigateTo("/login");
    }
  }
});
