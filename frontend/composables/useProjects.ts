import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { Project, ProjectUser, User } from "~/types";

export const useProjects = () => {
  const { client } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: [API_KEY.PROJECTS],
    queryFn: async (): Promise<Project[]> => (await client.get("/projects/")).data,
  });

  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: [API_KEY.PROJECTS_MEMBERS],
    queryFn: async (): Promise<User[]> => (await client.get("/projects/members/all/")).data,
  });

  const { mutateAsync: joinProject, isPending: isJoiningProject } = useMutation({
    mutationFn: async (data: { accessCode: string }): Promise<ProjectUser> =>
      (await client.post("/projects/join/", data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS] });
      snackbar.success("Successfully joined to project.");
    },
    onError: () => {
      snackbar.error("Wrong code provided!");
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

  return {
    projects,
    members,
    loadingProjects,
    loadingMembers,
    isJoiningProject,
    leavingProject,
    joinProject,
    leaveProject,
  };
};
