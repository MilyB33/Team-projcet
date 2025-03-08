<template>
  <div class="d-flex flex-column ga-5">
    <ReportDataTable
      title="Workspaces"
      :headers="workspacesReportsTableHeaders"
      :items="reportData.workspaces"
    />
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
import type { WorkspacesReport } from "~/types";

type WorkspacesReportDataTablesProps = {
  reportData?: WorkspacesReport;
  fetching: boolean;
};

const props = defineProps<WorkspacesReportDataTablesProps>();

const reportData = computed(() => {
  return prepareWorkspacesReportsTableData(props.reportData);
});
</script>
