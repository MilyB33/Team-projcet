import axios, { isAxiosError, type AxiosInstance } from "axios";
import { COOKIES } from "~/constant";

type AxiosClientContext = {
  client: AxiosInstance;
  isAuthToken: boolean;
  setAuthToken: (token: string) => void;
  removeAuthToken: () => void;
};

export const useInitializeAxiosClient = () => {
  const runtimeConfig = useRuntimeConfig();
  const cookie = useCookie(COOKIES.AUTH_TOKEN);
  const client = axios.create({ baseURL: runtimeConfig.public.API_URL });
  const isClientTokenSet = ref(false);

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

  const setAuthToken = (token: string) => {
    cookie.value = token;
    client.defaults.headers.common["Authorization"] = `bearer ${token}`;
    isClientTokenSet.value = true;
  };

  const removeAuthToken = () => {
    cookie.value = null;
    delete client.defaults.headers.common["Authorization"];
    isClientTokenSet.value = false;
  };

  onMounted(() => {
    if (cookie.value) {
      client.defaults.headers.common["Authorization"] = `bearer ${cookie.value}`;
      isClientTokenSet.value = true;
    }
  });

  const isAuthToken = computed(() => !!cookie.value && isClientTokenSet.value);

  return {
    client,
    setAuthToken,
    removeAuthToken,
    isAuthToken,
  };
};

export const useAxiosClient = () => {
  const context = inject<AxiosClientContext>("axiosClient");

  if (!context) {
    throw new Error("Axios client used outside the provider");
  }

  return context;
};
