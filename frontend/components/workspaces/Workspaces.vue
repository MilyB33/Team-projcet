<template>
  <div class="d-flex flex-column ga-4">
    <h2>Workspaces</h2>
    <div class="h-100 w-100">
      <WorkspacesDataTable
        :workspaces="workspaces || []"
        v-if="!loadingWorkspaces"
      />
      <CreateWorkspace v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { workspaces, loadingWorkspaces } = useWorkspaces();
</script>
