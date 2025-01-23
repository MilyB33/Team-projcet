import { useMutation, useQuery } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { LoginRequest, LoginResponse, CreateUserRequest, CreateUserResponse } from "~/types";

export const useAuth = () => {
  const { client, setAuthToken, isAuthToken } = useAxiosClient();
  const { snackbar } = useSnackbar();

  const { mutate: login, isPending: isLogging } = useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> =>
      (await client.post("http://localhost:9000/api/auth/login/", data)).data,
    onSuccess: (response) => {
      snackbar.success("Successfully logged in!");
      setAuthToken(response.accessToken);
      navigateTo("/");
    },
    onError: (error) => {
      snackbar.error(error.message || "Something went wrong!");
    },
  });

  const { mutate: createAccount, isPending: isCreatingAccount } = useMutation({
    mutationFn: async (data: CreateUserRequest): Promise<CreateUserResponse> =>
      (await client.post("http://localhost:9000/api/users/", data)).data,
    onSuccess: () => {
      snackbar.success("Successfully created account!");
      navigateTo("/login");
    },
    onError: (error) => {
      snackbar.error(error.message || "Something went wrong!");
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [API_KEY.USER],
    queryFn: () => client.get("http://localhost:9000/api/auth/me/"),
    enabled: isAuthToken,
    retry: 0,
  });

  return {
    login,
    createAccount,
    isLogging,
    isCreatingAccount,
    user,
    isLoadingUser,
  };
};
