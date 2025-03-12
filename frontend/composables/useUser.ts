import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { UpdateUserRequest, User } from "~/types";

export const useUser = () => {
  const { user } = useAuth();
  const { client } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  const isEmployer = computed(() => user.value?.typeId === 2);

  const { mutateAsync: updateUser, isPending: updatingUser } = useMutation({
    mutationFn: async (data: UpdateUserRequest): Promise<User> =>
      (await client.patch(`/users/${user.value?.id}`, data)).data,
    onSuccess: () => {
      snackbar.success("Changes saved successfully!");
      queryClient.invalidateQueries({ queryKey: [API_KEY.USER] });
    },
    onError: () => {
      snackbar.error();
    },
  });

  return {
    user,
    isEmployer,
    updateUser,
    updatingUser,
  };
};
