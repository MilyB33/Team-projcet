<template>
  <ReportsFilters :onSubmit="setFilters">
    <v-select
      label="Project"
      :items="projectsItems"
      density="compact"
      :disabled="loadingProjects"
      variant="outlined"
      v-model="project"
      :error-messages="projectError"
      hide-details
      max-width="300"
    />
  </ReportsFilters>
</template>

<script lang="ts" setup>
const { projectsItems, loadingProjects, setFilters } = useProjectReports();

const { value: project, errorMessage: projectError } = useField<number>("projectId");
</script>
