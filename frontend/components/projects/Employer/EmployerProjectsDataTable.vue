<template>
  <v-data-table
    :headers="projectsTableHeaders"
    :items="items"
    :group-by="[{ key: 'workspace', order: 'asc' }]"
    hide-default-footer
    style="min-height: 300px"
  >
    <template v-slot:item.actions="{ item }">
      <NuxtLink :to="`/projects/${item.id}`">
        <v-btn size="small">Manage</v-btn>
      </NuxtLink>
    </template>
    <template v-slot:item.accessCode="{ item }">
      <AccessCode :code="item.accessCode" />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { Project } from "~/types";
import { projectsTableHeaders, prepareProjectsTableData } from "~/utils/projects";

type ProjectsDataTableProps = {
  projects: Project[];
};

const props = defineProps<ProjectsDataTableProps>();

const items = computed(() => prepareProjectsTableData(props.projects));
</script>
