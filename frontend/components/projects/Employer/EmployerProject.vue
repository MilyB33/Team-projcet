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

    <EmployerProjectHeader
      v-if="project && !loadingProject"
      :project="project"
    />

    <EmployerProjectEdit
      v-if="project && !loadingProject"
      :project="project"
    />

    <EmployerProjectMembers
      v-if="project && !loadingProject"
      :project="project"
    />

    <EmployerProjectActiveMembers
      v-if="!loadingActiveMembers"
      :activeMembers="activeMembers || []"
      :refetchMembers="refetchMembers"
    />
  </div>
</template>

<script lang="ts" setup>
const { project, loadingProject, activeMembers, loadingActiveMembers, refetchMembers } =
  useProject();
</script>
