import { useQuery } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { MembersReport, WorkspacesReport } from "~/types";

export type MembersFilters = {
  memberId?: number[];
  startDate?: string;
  endDate?: string;
};

export const useMembersReport = () => {
  const { client } = useAxiosClient();
  const { members, loadingMembers } = useProjects();

  const memberItems = computed(
    () =>
      members.value?.map((item) => ({
        title: `${item.first_name} ${item.last_name} (${item.email})`,
        value: item.id,
      })) || [],
  );

  const filters = ref<MembersFilters>({
    memberId: [],
    startDate: undefined,
    endDate: undefined,
  });

  watch(memberItems, (newItems) => {
    if (newItems) {
      filters.value.memberId = newItems.map((item) => item.value);
    }
  });

  onMounted(() => {
    if (memberItems.value?.length) {
      filters.value.memberId = memberItems.value.map((item) => item.value);
    }
  });

  const isMemberIdSet = computed(() => {
    return !!filters.value.memberId?.length;
  });

  const filtersKey = computed(() => [API_KEY.MEMBERS_REPORT, filters.value]);

  const { data: membersReport, isFetching: fetchingMembersReport } = useQuery({
    queryKey: filtersKey,
    queryFn: async (): Promise<MembersReport> => {
      const filteredParams = Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => value !== undefined),
      );

      if (Array.isArray(filteredParams.workspaceId)) {
        filteredParams.workspaceId = filteredParams.workspaceId.join(",");
      }

      const params = new URLSearchParams(filteredParams as any).toString();

      return (await client.get(`/reports/members/?${params}`)).data;
    },
    enabled: isMemberIdSet,
  });

  const setFilters = (newFilters: MembersFilters) => {
    filters.value.memberId = newFilters.memberId;
    filters.value.endDate = newFilters.endDate;
    filters.value.startDate = newFilters.startDate;
  };

  return {
    membersReport,
    fetchingMembersReport,
    memberItems,
    loadingMembers,
    setFilters,
  };
};
