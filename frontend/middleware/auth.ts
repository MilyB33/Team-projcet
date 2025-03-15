import { COOKIES } from "~/constant";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authCookie = useCookie(COOKIES.AUTH_TOKEN);

  const allowedRoutes = ["login", "create-account"];

  if (!authCookie.value && !allowedRoutes.some((route) => to.path.includes(route))) {
    return navigateTo("/login");
  }

  if (authCookie.value && allowedRoutes.some((route) => to.path.includes(route))) {
    return navigateTo("/");
  }
});
