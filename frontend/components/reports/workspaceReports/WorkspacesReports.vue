<template>
  <div class="d-flex flex-column ga-4 h-100">
    <h2>Workspaces Report</h2>
    <WorkspacesReportsFilters
      :workspacesItems="workspacesItems || []"
      :loading="loadingWorkspaces"
      :setFilters="setFilters"
    />
    <WorkspacesReportDataTables
      :reportData="workspacesReports"
      :fetching="fetchingWorkspacesReports"
    />
  </div>
</template>

<script lang="ts" setup>
const {
  workspacesItems,
  loadingWorkspaces,
  workspacesReports,
  fetchingWorkspacesReports,
  setFilters,
} = useWorkspacesReports();
</script>
