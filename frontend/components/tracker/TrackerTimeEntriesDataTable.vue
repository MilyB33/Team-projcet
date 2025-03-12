<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="groupedEntries"
      item-value="id"
      :group-by="[{ key: 'day', order: false }]"
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

  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "day").startOf("day");

  return lastWeekEntries.value
    .map((entry) => {
      const entryDate = moment(entry.startTime).startOf("day");
      let dayLabel = entryDate.format("dddd");

      if (entryDate.isSame(today, "day")) {
        dayLabel = "Today";
      } else if (entryDate.isSame(yesterday, "day")) {
        dayLabel = "Yesterday";
      }

      return {
        ...entry,
        projectId: entry.projectUser.projectId,
        projectName: entry.projectUser.project.name,
        day: dayLabel,
        totalTime: formatTotalTime(moment(entry.endTime).diff(moment(entry.startTime), "seconds")),
      };
    })
    .sort((a, b) => {
      const order = { Today: 0, Yesterday: 1 };
      return (
        // @ts-ignore
        (order[a.day] ?? 2) - (order[b.day] ?? 2) || moment(b.startTime).diff(moment(a.startTime))
      );
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
