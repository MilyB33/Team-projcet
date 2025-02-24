<template>
  <div class="d-flex flex-column ga-4 h-100">
    <h2>Projects Report</h2>
    <ProjectReportsFilters
      :projectsItems="projectsItems"
      :loading="loadingProjects"
      :setFilters="setFilters"
    />
    <EmployeeProjectsReportsDataTables
      :reportData="projectsReport"
      :fetching="fetchingProjectsReport"
    />
  </div>
</template>

<script lang="ts" setup>
const { projectsItems, loadingProjects, projectsReport, fetchingProjectsReport, setFilters } =
  useProjectReports();
</script>
