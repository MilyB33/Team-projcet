<template>
  <div class="d-flex flex-column ga-4 h-100">
    <div class="d-flex align-center">
      <h2>Projects</h2>
    </div>

    <div
      class="self-center mx-auto my-auto"
      v-if="loadingProjects"
    >
      <v-progress-circular
        indeterminate
        :size="55"
        :width="9"
      ></v-progress-circular>
    </div>

    <EmployeeProjectsEmptyState v-if="!loadingProjects && !projects?.length" />

    <EmployeeProjectsDataTable
      v-if="projects?.length"
      :projects="projects"
    />
  </div>
</template>

<script lang="ts" setup>
const { loadingProjects, projects } = useProjects();
console.log(loadingProjects, projects);
</script>
