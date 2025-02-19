<template>
  <div class="d-flex flex-column ga-5">
    <div class="d-flex flex-column ga-2">
      <h3>Workspaces</h3>
      <v-data-table
        hide-default-footer
        :headers="workspacesReportsTableHeaders"
        :items="reportData.workspaces"
        height="250"
        sticky
      ></v-data-table>
    </div>
    <div class="d-flex flex-column ga-2">
      <h3>Projects</h3>
      <v-data-table
        hide-default-footer
        :headers="workspacesReportsProjectsTableHeaders"
        :items="reportData.projects"
        height="250"
        sticky
      ></v-data-table>
    </div>
    <div class="d-flex flex-column ga-2">
      <h3>Members</h3>
      <v-data-table
        hide-default-footer
        :headers="workspacesReportsMembersTableHeaders"
        :items="reportData.members"
        height="250"
        sticky
      ></v-data-table>
    </div>
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
