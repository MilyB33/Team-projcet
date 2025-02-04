import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { Project } from "~/types";

export const useProject = () => {
  const { client } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  const route = useRoute();

  const projectId = route.params.id;
  console.log(projectId);
  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: [API_KEY.PROJECT, projectId],
    queryFn: async (): Promise<Project> => (await client.get(`/projects/${projectId}`)).data,
    enabled: !!projectId,
  });

  return {
    project,
    loadingProject,
  };
};
