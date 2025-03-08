<template>
  <ReportsFilters
    :onSubmit="setFilters"
    :initial-values="{ workspaceId: initialWorkspaces }"
  >
    <IDFilterField
      v-if="workspacesItems?.length"
      :items="workspacesItems"
      :loading="loading"
      fieldId="workspaceId"
    />
  </ReportsFilters>
</template>

<script lang="ts" setup>
type WorkspacesReportsFiltersProps = {
  workspacesItems: { title: string; value: number }[];
  loading: boolean;
  setFilters: (newFilters: WorkspacesFilters) => void;
};

const props = defineProps<WorkspacesReportsFiltersProps>();

const initialWorkspaces = computed(() => props.workspacesItems?.map((item) => item.value) || []);
</script>
