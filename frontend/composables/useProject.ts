import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { CreateProjectRequest, Project, UpdateProjectRequest } from "~/types";

export const useProject = () => {
  const { client } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  const route = useRoute();

  const projectId = route.params.id;

  const invalidateProjects = () => {
    queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS] });
    queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS, projectId] });
  };

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: [API_KEY.PROJECTS, projectId],
    queryFn: async (): Promise<Project> => (await client.get(`/projects/${projectId}`)).data,
    enabled: !!projectId,
  });

  const { mutateAsync: generateAccessCode, isPending: generatingAccessCode } = useMutation({
    mutationFn: async (id: number): Promise<Project> =>
      (await client.post(`/projects/${id}/access_code/`)).data,
    onSuccess: () => {
      invalidateProjects();
      snackbar.success("Access code generated.");
    },
    onError: () => {
      snackbar.error();
    },
  });

  const { mutate: deleteProject, isPending: deletingProject } = useMutation({
    mutationFn: async (id: number): Promise<void> => (await client.delete(`/projects/${id}/`)).data,
    onSuccess: () => {
      invalidateProjects();
      snackbar.success("Project deleted.");
    },
    onError: () => {
      snackbar.error();
    },
  });

  const { mutate: updateProject, isPending: updatingProject } = useMutation({
    mutationFn: async ({ id, ...data }: UpdateProjectRequest): Promise<Project> =>
      (await client.patch(`/projects/${id}/`, data)).data,
    onSuccess: () => {
      invalidateProjects();
      snackbar.success("Project updated.");
    },
    onError: () => {
      snackbar.error();
    },
  });

  return {
    project,
    loadingProject,
    generatingAccessCode,
    deletingProject,
    updatingProject,
    generateAccessCode,
    deleteProject,
    updateProject,
  };
};
