import { useQuery } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { Project } from "~/types";

export const useProjects = () => {
  const { client } = useAxiosClient();

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: [API_KEY.PROJECTS],
    queryFn: async (): Promise<Project[]> => (await client.get("/projects/")).data,
  });

  return { projects, loadingProjects };
};
