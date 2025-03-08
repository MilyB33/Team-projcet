<template>
  <v-divider></v-divider>
  <h2>Active members</h2>
  <v-data-table
    hide-default-footer
    :headers="employerActiveMembersTableHeaders"
    :items="items"
  >
  </v-data-table>
</template>

<script lang="ts" setup>
import type { ProjectUser } from "~/types";

type EmployerProjectActiveMembersProps = {
  activeMembers: ProjectUser[];
};

const props = defineProps<EmployerProjectActiveMembersProps>();

const items = computed(() => prepareEmployerActiveMembersTableData(props.activeMembers));
</script>
