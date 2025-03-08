<template>
  <div class="d-flex flex-column ga-5">
    <ReportDataTable
      title="Projects"
      :headers="workspacesReportsProjectsTableHeaders"
      :items="reportData.projects"
    />
    <ReportDataTable
      title="Members"
      :headers="workspacesReportsMembersTableHeaders"
      :items="reportData.members"
    />
  </div>
</template>

<script lang="ts" setup>
import type { ProjectsReport } from "~/types";

type ProjectsReportDataTablesProps = {
  reportData?: ProjectsReport;
  fetching: boolean;
};

const props = defineProps<ProjectsReportDataTablesProps>();

const reportData = computed(() => {
  return prepareProjectsReportsTableData(props.reportData);
});
</script>
