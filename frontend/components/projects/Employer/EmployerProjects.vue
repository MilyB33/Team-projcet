<template>
  <div class="d-flex flex-column ga-4 h-100">
    <div class="d-flex align-center">
      <h2>Projects</h2>

      <div class="ml-auto">
        <CreateProjectModal
          v-if="workspaces"
          :workspaces="workspaces"
        />
      </div>
    </div>

    <div
      class="self-center mx-auto my-auto"
      v-if="loadingProjects || loadingWorkspaces"
    >
      <v-progress-circular
        indeterminate
        :size="55"
        :width="9"
      ></v-progress-circular>
    </div>

    <ProjectsEmptyState
      v-if="!loadingProjects && !projects?.length && !loadingWorkspaces"
      :workspaces="workspaces || []"
    />

    <EmployerProjectsDataTable
      v-if="projects?.length"
      :projects="projects"
    />
  </div>
</template>

<script lang="ts" setup>
const { workspaces, loadingWorkspaces } = useWorkspaces();
const { projects, loadingProjects } = useProjects();
</script>
