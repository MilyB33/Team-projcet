import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { CreateWorkspaceRequest, UpdateWorkspaceRequest, Workspace } from "~/types";

export const useWorkspaces = () => {
  const { client } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  const { data: workspaces, isLoading: loadingWorkspaces } = useQuery({
    queryKey: [API_KEY.WORKSPACES],
    queryFn: async (): Promise<Workspace[]> => (await client.get("/workspaces/")).data,
  });

  const { mutateAsync: createWorkspace, isPending: creatingWorkspace } = useMutation({
    mutationFn: async (data: CreateWorkspaceRequest) =>
      (await client.post("/workspaces/", data)).data,
    onSuccess: () => {
      snackbar.success("Successfully created workspace.");
      queryClient.invalidateQueries({ queryKey: [API_KEY.WORKSPACES] });
    },
    onError: () => {
      snackbar.error("Something went wrong. Try again!");
    },
  });

  const { mutateAsync: deleteWorkspace, isPending: deletingWorkspace } = useMutation({
    mutationFn: async (id: number) => await client.delete(`/workspaces/${id}`),
    onSuccess: () => {
      snackbar.success("Successfully deleted workspace.");
      queryClient.invalidateQueries({ queryKey: [API_KEY.WORKSPACES] });
    },
    onError: () => {
      snackbar.error("Something went wrong. Try again!");
    },
  });

  const { mutateAsync: updateWorkspace, isPending: updatingWorkspace } = useMutation({
    mutationFn: async (data: UpdateWorkspaceRequest) =>
      await client.patch(`/workspaces/${data.id}`, { name: data.name }),
    onSuccess: () => {
      snackbar.success("Successfully updated workspace.");
      queryClient.invalidateQueries({ queryKey: [API_KEY.WORKSPACES] });
    },
    onError: () => {
      snackbar.error("Something went wrong. Try again!");
    },
  });

  return {
    workspaces,
    loadingWorkspaces,
    creatingWorkspace,
    deletingWorkspace,
    updatingWorkspace,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
  };
};
