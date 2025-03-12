<template>
  <div class="d-flex flex-column ga-4 h-100">
    <NuxtLink to="/projects">
      <v-btn
        prepend-icon="mdi-arrow-left"
        size="small"
        >Go to projects</v-btn
      >
    </NuxtLink>

    <div
      class="self-center mx-auto my-auto"
      v-if="loadingProject"
    >
      <v-progress-circular
        indeterminate
        :size="55"
        :width="9"
      ></v-progress-circular>
    </div>

    <EmployeeProjectHeader
      v-if="project && !loadingProject"
      :project="project"
    />

    <div v-if="project && !loadingProject">
      <h2>Description:</h2>
      <p>{{ project?.description }}</p>
    </div>

    <v-divider />

    <EmployeeProjectTimeEntries
      v-if="project && !loadingProject"
      :timeEntries="project.members[0].time_entries"
      :projectId="project.id"
    />
  </div>
</template>

<script lang="ts" setup>
const { project, loadingProject } = useProject();
</script>
