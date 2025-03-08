<template>
  <div class="d-flex flex-column ga-5">
    <ReportDataTable
      title="Projects"
      :headers="workspacesReportsProjectsTableHeaders"
      :items="reportData.projects"
    />
    <ReportDataTable
      title="Time Entries"
      :headers="employeeReportsTimeEntriesTableHeaders"
      :items="reportData.timeEntries"
    />
  </div>
</template>

<script lang="ts" setup>
import type { EmployeeProjectsReport } from "~/types";

type EmployeeProjectsDataTablesProps = {
  reportData?: EmployeeProjectsReport;
  fetching: boolean;
};

const props = defineProps<EmployeeProjectsDataTablesProps>();

const reportData = computed(() => {
  return prepareEmployeeProjectsReportsTableData(props.reportData);
});
</script>
