<template>
  <ReportsFilters
    :onSubmit="setFilters"
    :initial-values="{ projectId: initialProjects }"
  >
    <IDFilterField
      v-if="projectsItems?.length"
      :items="projectsItems"
      :loading="loading"
      fieldId="projectId"
    />
  </ReportsFilters>
</template>

<script lang="ts" setup>
type ProjectsReportsFiltersProps = {
  projectsItems: { title: string; value: number }[];
  loading: boolean;
  setFilters: (newFilters: ProjectFilters) => void;
};

const props = defineProps<ProjectsReportsFiltersProps>();

const initialProjects = computed(() => props.projectsItems?.map((item) => item.value) || []);
</script>
