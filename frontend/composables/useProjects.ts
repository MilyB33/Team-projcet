import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { CreateProjectRequest, Project } from "~/types";

export const useProjects = () => {
  const { client } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: [API_KEY.PROJECTS],
    queryFn: async (): Promise<Project[]> => (await client.get("/projects/")).data,
  });

  const { mutateAsync: createProject, isPending: creatingProject } = useMutation({
    mutationFn: async (data: CreateProjectRequest) => (await client.post("/projects/", data)).data,
    onSuccess: () => {
      snackbar.success("Successfully created project.");
      queryClient.invalidateQueries({ queryKey: [API_KEY.WORKSPACES] });
      queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS] });
    },
    onError: () => {
      snackbar.error();
    },
  });

  return { projects, loadingProjects, creatingProject, createProject };
};
