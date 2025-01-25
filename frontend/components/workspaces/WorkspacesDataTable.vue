<template>
  <v-data-table
    :headers="tableHeaders"
    :items="items"
    hide-default-footer
    style="min-height: 300px"
  >
    <template v-slot:item.actions="{ item }">
      <EditWorkspaceModal
        :workspaceId="item.id"
        :name="item.name"
      />
      <ConfirmDeleteWorkspaceModal
        :name="item.name"
        :workspaceId="item.id"
      /> </template
  ></v-data-table>
</template>

<script lang="ts" setup>
import type { Workspace } from "~/types";
import { tableHeaders, prepareTableData } from "~/utils/workspaces";

type WorkspacesDataTableProps = {
  workspaces: Workspace[];
};

const props = defineProps<WorkspacesDataTableProps>();

const items = computed(() => prepareTableData(props.workspaces));
</script>
