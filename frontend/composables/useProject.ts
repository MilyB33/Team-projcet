import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { CreateProjectRequest, Project, ProjectUser, UpdateProjectRequest } from "~/types";

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

  const {
    data: activeMembers,
    isLoading: loadingActiveMembers,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: [API_KEY.ACTIVE_MEMBERS],
    queryFn: async (): Promise<ProjectUser[]> =>
      (await client.get(`/projects/${projectId}/members/active`)).data,
    enabled: !!projectId,
  });

  const { mutateAsync: createProject, isPending: creatingProject } = useMutation({
    mutationFn: async (data: CreateProjectRequest): Promise<Project> =>
      (await client.post("/projects/", data)).data,
    onSuccess: () => {
      snackbar.success("Successfully created project.");
      queryClient.invalidateQueries({ queryKey: [API_KEY.WORKSPACES] });
      queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS] });
    },
    onError: () => {
      snackbar.error();
    },
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

  const { mutateAsync: deleteProject, isPending: deletingProject } = useMutation({
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
    creatingProject,
    generatingAccessCode,
    deletingProject,
    updatingProject,
    activeMembers,
    loadingActiveMembers,
    createProject,
    generateAccessCode,
    deleteProject,
    updateProject,
    refetchMembers,
  };
};
