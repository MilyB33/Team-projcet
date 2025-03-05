import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type {
  LoginRequest,
  LoginResponse,
  CreateUserRequest,
  CreateUserResponse,
  User,
} from "~/types";

export const useAuth = () => {
  const { client, setAuthToken, removeAuthToken, isAuthToken } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  const { mutate: login, isPending: isLogging } = useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> =>
      (await client.post("/auth/login/", data)).data,
    onSuccess: (response) => {
      snackbar.success("Successfully logged in!");
      setAuthToken(response.accessToken);
      queryClient.invalidateQueries({ queryKey: [API_KEY.USER] });
      navigateTo("/");
    },
    onError: (error) => {
      snackbar.error(error.message || "Something went wrong!");
    },
  });

  const { mutate: createAccount, isPending: isCreatingAccount } = useMutation({
    mutationFn: async (data: CreateUserRequest): Promise<CreateUserResponse> =>
      (await client.post("/users/", data)).data,
    onSuccess: () => {
      snackbar.success("Successfully created account!");
      navigateTo("/login");
    },
    onError: (error) => {
      snackbar.error(error.message || "Something went wrong!");
    },
  });

  const logout = () => {
    removeAuthToken();
    queryClient.resetQueries({ queryKey: [API_KEY.USER] });
    queryClient.resetQueries({ queryKey: [API_KEY.WORKSPACES] });
    queryClient.resetQueries({ queryKey: [API_KEY.PROJECTS] });

    navigateTo("/login");
  };

  const { mutate: requestPasswordReset, isPending: isRequestingPasswordReset } = useMutation({
    mutationFn: async (email: string): Promise<{ message: string }> =>
      (await client.post("/auth/request-reset/", { email })).data,
    onSuccess: () => {
      snackbar.success("Reset link was sent. Check your email inbox!");
    },
    onError: () => {
      snackbar.error();
    },
  });

  const { mutateAsync: resetPassword, isPending: isResettingPassword } = useMutation({
    mutationFn: async (data: {
      token: string;
      newPassword: string;
    }): Promise<{ message: string }> => (await client.post("/auth/reset-password/", data)).data,
    onSuccess: () => {
      snackbar.success("Successfully changed password. You can now log in!");
      logout();
    },
    onError: () => {
      snackbar.error();
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [API_KEY.USER],
    queryFn: async (): Promise<User> => (await client.get("/auth/me/")).data,
    enabled: isAuthToken,
    retry: 0,
    retryOnMount: false,
  });

  return {
    login,
    createAccount,
    logout,
    requestPasswordReset,
    resetPassword,
    isLogging,
    isCreatingAccount,
    user,
    isLoadingUser,
    isRequestingPasswordReset,
    isResettingPassword,
  };
};
