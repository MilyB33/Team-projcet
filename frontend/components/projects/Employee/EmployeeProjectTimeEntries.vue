<template>
  <div style="overflow-y: auto">
    <h2>Your time entries</h2>

    <v-data-table
      :headers="employeeProjectsTimeEntriesHeaders"
      :items="items"
      hide-default-footer
      class="mt-2"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2">
          <ConfirmDialog
            title="Delete entry"
            text="Are you sure you want to delete this entry?"
            :anchorProps="{
              size: 'small',
              icon: 'mdi-delete',
              color: 'red',
              variant: 'text',
              class: 'ml-auto',
              disabled: isDeletingEntry,
            }"
            :onConfirm="
              async () => {
                await onDelete(item.id);
              }
            "
          />

          <EditTimeEntry
            :timeEntry="item.timeEntry"
            :projectId="projectId"
          />
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts" setup>
import type { TimeEntry } from "~/types";

type EmployeeProjectTimeEntriesProps = {
  timeEntries: TimeEntry[];
  projectId: number;
};

const props = defineProps<EmployeeProjectTimeEntriesProps>();

const items = computed(() => {
  return prepareEmployeeProjectsTimeEntries(props.timeEntries);
});

const { deleteEntry, isDeletingEntry } = useTimeEntries();

const onDelete = async (id: number) => {
  await deleteEntry(id);
};
</script>
