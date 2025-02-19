import { useQuery } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { WorkspacesReport } from "~/types";

export type WorkspacesFilters = {
  workspaceId?: number[];
  startDate?: string;
  endDate?: string;
};

export const useWorkspacesReports = () => {
  const { client } = useAxiosClient();
  const { workspaces, loadingWorkspaces } = useWorkspaces();

  const workspacesItems = computed(() =>
    workspaces.value?.map((item) => ({ title: item.name, value: item.id })),
  );

  const filters = ref<WorkspacesFilters>({
    workspaceId: [],
    startDate: undefined,
    endDate: undefined,
  });

  watch(workspacesItems, (newItems) => {
    if (newItems) {
      filters.value.workspaceId = newItems.map((item) => item.value);
    }
  });

  onMounted(() => {
    if (workspacesItems.value?.length) {
      filters.value.workspaceId = workspacesItems.value.map((item) => item.value);
    }
  });

  const isWorkspaceIdSet = computed(() => {
    return !!filters.value.workspaceId?.length;
  });

  const filtersKey = computed(() => [API_KEY.PROJECTS_REPORT, filters.value]);

  const { data: workspacesReports, isFetching: fetchingWorkspacesReports } = useQuery({
    queryKey: filtersKey,
    queryFn: async (): Promise<WorkspacesReport> => {
      const filteredParams = Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => value !== undefined),
      );

      if (Array.isArray(filteredParams.workspaceId)) {
        filteredParams.workspaceId = filteredParams.workspaceId.join(",");
      }

      const params = new URLSearchParams(filteredParams as any).toString();

      return (await client.get(`/reports/workspaces/?${params}`)).data;
    },
    enabled: isWorkspaceIdSet,
  });

  const setFilters = (newFilters: WorkspacesFilters) => {
    filters.value.workspaceId = newFilters.workspaceId;
    filters.value.endDate = newFilters.endDate;
    filters.value.startDate = newFilters.startDate;
  };

  return {
    workspacesReports,
    fetchingWorkspacesReports,
    workspacesItems,
    loadingWorkspaces,
    setFilters,
  };
};
