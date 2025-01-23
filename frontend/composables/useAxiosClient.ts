import axios, { isAxiosError } from "axios";
import { COOKIES } from "~/constant";

export const useAxiosClient = () => {
  const cookie = useCookie(COOKIES.AUTH_TOKEN);
  const client = axios.create({ baseURL: "http://localhost:9000/api" });

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const message =
        isAxiosError(error) && error.response?.data.message
          ? error.response?.data.message
          : error.message;

      return Promise.reject({ ...error, message });
    },
  );

  onMounted(() => {
    if (cookie.value) {
      axios.defaults.headers.common["Authorization"] = `bearer ${cookie.value}`;
    }
  });

  const setAuthToken = (token: string) => {
    cookie.value = token;
    axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
  };

  const isAuthToken = computed(() => !!cookie.value);

  return {
    client,
    setAuthToken,
    isAuthToken,
  };
};
