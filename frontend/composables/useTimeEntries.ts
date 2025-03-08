import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { CreateTimeEntryRequest, TimeEntry, UpdateTimeEntryRequest } from "~/types";

export const useTimeEntries = () => {
  const { client } = useAxiosClient();
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: [API_KEY.UNFINISHED_TIME_ENTRY] });
    queryClient.invalidateQueries({ queryKey: [API_KEY.MEMBERS_REPORT] });
    queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS_REPORT] });
    queryClient.invalidateQueries({ queryKey: [API_KEY.PROJECTS] });
    queryClient.invalidateQueries({ queryKey: [API_KEY.SUMMARY_REPORT] });
    queryClient.invalidateQueries({ queryKey: [API_KEY.WORKSPACES_REPORT] });
  };

  const { data: lastTimeEntry, isLoading: loadingLastTimeEntry } = useQuery({
    queryKey: [API_KEY.UNFINISHED_TIME_ENTRY],
    queryFn: async (): Promise<TimeEntry> => (await client.get("/time_entries/unfinished")).data,
  });

  const { data: lastWeekEntries, isLoading: loadingLastWeekEntries } = useQuery({
    queryKey: [API_KEY.LAST_WEEK_ENTRIES],
    queryFn: async (): Promise<TimeEntry[]> => (await client.get("/time_entries/last_week")).data,
  });

  const { mutateAsync: createEntry, isPending: creatingTimeEntry } = useMutation({
    mutationFn: async (data: CreateTimeEntryRequest): Promise<TimeEntry> =>
      (await client.post("/time_entries/", data)).data,
    onSuccess: () => {
      invalidateQueries();
    },
    onError: () => {
      snackbar.error();
    },
  });

  const { mutateAsync: endEntry, isPending: endingTimeEntry } = useMutation({
    mutationFn: async (entryId: number): Promise<TimeEntry> =>
      (await client.post(`/time_entries/${entryId}/end/`)).data,
    onSuccess: () => {
      invalidateQueries();
      snackbar.success("Entry successfully saved!");
    },
    onError: () => {
      snackbar.error();
    },
  });

  const { mutateAsync: deleteEntry, isPending: isDeletingEntry } = useMutation({
    mutationFn: async (entryId: number): Promise<{ message: string }> =>
      (await client.delete(`time_entries/${entryId}/`)).data,
    onSuccess: () => {
      invalidateQueries();
      snackbar.success("Entry successfully deleted!");
    },
    onError: () => {
      snackbar.error();
    },
  });

  const { mutateAsync: updateEntry, isPending: isUpdatingEntry } = useMutation({
    mutationFn: async (data: UpdateTimeEntryRequest) => {
      const { entryId, ...rest } = data;

      return (await client.patch(`time_entries/${entryId}/`, rest)).data;
    },
  });

  onBeforeRouteLeave(() => {
    queryClient.resetQueries({ queryKey: [API_KEY.UNFINISHED_TIME_ENTRY] });
    queryClient.removeQueries({ queryKey: [API_KEY.UNFINISHED_TIME_ENTRY] });
  });

  return {
    lastTimeEntry,
    loadingLastTimeEntry,
    creatingTimeEntry,
    endingTimeEntry,
    isDeletingEntry,
    isUpdatingEntry,
    createEntry,
    endEntry,
    deleteEntry,
    updateEntry,
  };
};
