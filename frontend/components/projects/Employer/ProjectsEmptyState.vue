<template>
  <div class="d-flex flex-column ga-6 align-center justify-center text-center h-100">
    <template v-if="workspaces.length">
      <h2>Looks like you don't have any projects yet.</h2>

      <CreateProjectModal :workspaces="workspaces" />
    </template>
    <template v-else>
      <h2>Looks like you don't have any workspace yet.</h2>
      <p>Create workspace in order to create project.</p>

      <NuxtLink to="/workspaces">
        <v-btn>Create workspace</v-btn>
      </NuxtLink>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Workspace } from "~/types";

type ProjectsEmptyStateProps = {
  workspaces: Workspace[];
};

defineProps<ProjectsEmptyStateProps>();
</script>
