<template>
  <v-divider></v-divider>
  <div class="d-flex">
    <h2>Active members</h2>
    <v-btn
      @click="refetchMembers"
      class="ml-auto"
      >Refetch</v-btn
    >
  </div>
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
  refetchMembers: () => void;
};

const props = defineProps<EmployerProjectActiveMembersProps>();

const items = computed(() => prepareEmployerActiveMembersTableData(props.activeMembers));
</script>
