import { useQuery } from "@tanstack/vue-query";
import { API_KEY } from "~/constant";
import type { EmployeeSummaryReport, EmployerSummaryReport } from "~/types";

export const useSummaryReport = () => {
  const { client } = useAxiosClient();

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: [API_KEY.SUMMARY_REPORT],
    queryFn: async (): Promise<EmployeeSummaryReport | EmployerSummaryReport> =>
      (await client.get("/reports/summary/")).data,
  });

  const employeeSummary = computed(() => summary.value as EmployeeSummaryReport);

  const employerSummary = computed(() => summary.value as EmployerSummaryReport);

  return {
    employeeSummary,
    employerSummary,
    loadingSummary,
  };
};
