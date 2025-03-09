<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="groupedEntries"
      item-value="id"
      :group-by="[{ key: 'day', order: 'asc' }]"
      class="elevation-1"
      dense
      hide-default-footer
    >
      <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr>
          <td
            :colspan="columns.length"
            class="pa-4 bg-blue white--text text-uppercase font-weight-bold"
          >
            <div class="d-flex align-center">
              <v-btn
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                color="white"
                density="comfortable"
                size="small"
                variant="outlined"
                @click="toggleGroup(item)"
              ></v-btn>
              <span class="ms-4">{{ item.value }}</span>
            </div>
          </td>
        </tr>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              v-bind="props"
              size="small"
            ></v-btn>
          </template>
          <v-card>
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
              :timeEntry="item"
              :projectId="item.projectId"
            />
          </v-card>
        </v-menu>
      </template>

      <template v-slot:item.description="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <span v-bind="props">{{ item.description }}</span>
          </template>
          <span>{{ item.description }}</span>
        </v-tooltip>
      </template>

      <template v-slot:item.projectName="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <span v-bind="props">{{ item.projectName }}</span>
          </template>
          <span>{{ item.projectName }}</span>
        </v-tooltip>
      </template>

      <template v-slot:item.time="{ item }">
        {{ formatDate(item.startTime) }} - {{ formatDate(item.endTime) }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import type { TimeEntry } from "~/types";

const { lastWeekEntries, deleteEntry, isDeletingEntry } = useTimeEntries();

const onDelete = async (id: number) => {
  await deleteEntry(id);
};

const formatTotalTime = (totalSeconds: number) => {
  if (totalSeconds < 60) {
    return "00:01";
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const formatDate = (datetime: Date) => {
  return moment(datetime).format("HH:mm:ss");
};

const groupedEntries = computed(() => {
  if (!lastWeekEntries.value) return [];

  return lastWeekEntries.value.map((entry) => {
    const entryDate = moment(entry.startTime).startOf("day");
    let dayLabel = entryDate.format("dddd");

    if (entryDate.isSame(moment().startOf("day"), "day")) {
      dayLabel = "Today";
    } else if (entryDate.isSame(moment().subtract(1, "day").startOf("day"), "day")) {
      dayLabel = "Yesterday";
    }

    return {
      ...entry,
      projectId: entry.projectUser.projectId,
      description: entry.description,
      projectName: entry.projectUser.project.name,
      day: dayLabel,
      totalTime: formatTotalTime(moment(entry.endTime).diff(moment(entry.startTime), "seconds")),
    };
  });
});

const headers = [
  { title: "Task Name", key: "description", sortable: false },
  { title: "Project Name", key: "projectName", sortable: false },
  { title: "Time", key: "time", sortable: false },
  { title: "Duration", key: "totalTime", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
