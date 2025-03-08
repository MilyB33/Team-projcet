import { useQuery } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";

export type ProjectFilters = {
  projectId?: number[];
  startDate?: string;
  endDate?: string;
};

export const useProjectReports = () => {
  const { client } = useAxiosClient();
  const { projects, loadingProjects } = useProjects();

  const filters = ref<ProjectFilters>({
    projectId: [],
    startDate: undefined,
    endDate: undefined,
  });

  const projectsItems = computed(
    () => projects.value?.map((item) => ({ title: item.name, value: item.id })) || [],
  );

  watch(projectsItems, (newItems) => {
    if (newItems) {
      filters.value.projectId = newItems.map((item) => item.value);
    }
  });

  onMounted(() => {
    if (projectsItems.value?.length) {
      filters.value.projectId = projectsItems.value.map((item) => item.value);
    }
  });

  const isProjectIdSet = computed(() => {
    return !!filters.value.projectId?.length;
  });

  const filtersKey = computed(() => [API_KEY.PROJECTS_REPORT, filters.value]);

  const { data: projectsReport, isFetching: fetchingProjectsReport } = useQuery({
    queryKey: filtersKey,
    queryFn: async () => {
      const filteredParams = Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => value !== undefined),
      );

      if (Array.isArray(filteredParams.projectId)) {
        filteredParams.projectId = filteredParams.projectId.join(",");
      }
      const params = new URLSearchParams(filteredParams as any).toString();

      return (await client.get(`/reports/projects/?${params}`)).data;
    },
    enabled: isProjectIdSet,
  });

  const setFilters = (newFilters: ProjectFilters) => {
    filters.value.projectId = newFilters.projectId;
    filters.value.endDate = newFilters.endDate;
    filters.value.startDate = newFilters.startDate;
  };

  return {
    projectsReport,
    fetchingProjectsReport,
    projectsItems,
    loadingProjects,
    setFilters,
  };
};
