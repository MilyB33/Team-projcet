<template>
  <v-divider></v-divider>
  <h2>Members</h2>
  <v-data-table
    hide-default-footer
    :headers="projectMembersHeaders"
    :items="items"
  >
    <template v-slot:item.actions="{ item }">
      <v-tooltip
        text="Can't remove author."
        :disabled="user?.id !== item.userId"
      >
        <template v-slot:activator="{ props }">
          <div v-bind="props">
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              :disabled="user?.id === item.userId"
            ></v-btn>
          </div>
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import { projectMembersHeaders, prepareProjectsMembersData } from "#imports";
import type { Project } from "~/types";

type EmployerProjectMembers = {
  project: Project;
};

const props = defineProps<EmployerProjectMembers>();
const { user } = useUser();

const items = computed(() => prepareProjectsMembersData(props.project.members));
</script>
