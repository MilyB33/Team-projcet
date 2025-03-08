<template>
  <v-data-table
    :headers="employeeProjectsTableHeaders"
    :items="items"
    hide-default-footer
    style="min-height: 300px"
  >
    <template v-slot:item.name="{ item }">
      <div>
        <NuxtLink
          :to="`/projects/${item.id}`"
          class="text-black"
        >
          <span>
            {{ item.name }}
          </span>
        </NuxtLink>
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <LeaveProject :projectId="item.id" />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { Project, User } from "~/types";
import { employeeProjectsTableHeaders, prepareEmployeeProjectsTableData } from "~/utils/projects";

type ProjectsDataTableProps = {
  projects: Project[];
};

const props = defineProps<ProjectsDataTableProps>();

const { user } = useUser();

const items = computed(() => prepareEmployeeProjectsTableData(props.projects, user.value as User));
</script>
