import { useQuery } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";

type Filters = {
  projectId?: number;
  startDate?: string;
  endDate?: string;
};

export const useProjectReports = () => {
  const { client } = useAxiosClient();
  const { projects, loadingProjects } = useProjects();

  const filters = ref<Filters>({
    projectId: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const projectsItems = computed(
    () => projects.value?.map((item) => ({ title: item.name, value: item.id })) || [],
  );

  const { data: projectsReport, isFetching: fetchingProjectsReport } = useQuery({
    queryKey: [API_KEY.PROJECTS_REPORT, filters.value],
    queryFn: async () => {
      const filteredParams = Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => value !== undefined),
      );
      const params = new URLSearchParams(filteredParams as any).toString();
      return (await client.get(`/reports/projects/?${params}`)).data;
    },
  });

  const setFilters = (newFilters: Filters) => {
    filters.value = {
      projectId: newFilters.projectId,
      endDate: newFilters.endDate,
      startDate: newFilters.startDate,
    };
  };

  return {
    projectsReport,
    projectsItems,
    loadingProjects,
    fetchingProjectsReport,
    setFilters,
  };
};
