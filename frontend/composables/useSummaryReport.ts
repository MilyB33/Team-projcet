import { useQuery } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { EmployeeSummaryReport } from "~/types";

export const useSummaryReport = () => {
  const { client } = useAxiosClient();

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: [API_KEY.SUMMARY_REPORT],
    queryFn: async (): Promise<EmployeeSummaryReport> =>
      (await client.get("/reports/summary/")).data,
  });

  const employeeSummary = computed(() => summary.value as EmployeeSummaryReport);

  return {
    employeeSummary,
    loadingSummary,
  };
};
