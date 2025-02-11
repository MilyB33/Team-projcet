import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { Project, ProjectUser } from "~/types";

export const useProjects = () => {
  const { client } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: [API_KEY.PROJECTS],
    queryFn: async (): Promise<Project[]> => (await client.get("/projects/")).data,
  });

  const { mutateAsync: joinProject, isPending: isJoiningProject } = useMutation({
    mutationFn: async (data: { accessCode: string }): Promise<ProjectUser> =>
      (await client.post("/projects/join/", data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS] });
      snackbar.success("Successfully joined to project.");
    },
    onError: () => {
      snackbar.error();
    },
  });

  const { mutateAsync: leaveProject, isPending: leavingProject } = useMutation({
    mutationFn: async (id: number): Promise<{ message: string }> =>
      (await client.delete(`/projects/${id}/leave/`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS] });
      snackbar.success("Successfully left project.");
    },
    onError: () => {
      snackbar.error();
    },
  });

  return { projects, loadingProjects, isJoiningProject, leavingProject, joinProject, leaveProject };
};
