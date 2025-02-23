<template>
  <div class="d-flex flex-column ga-5">
    <ReportDataTable
      title="Users"
      :headers="workspacesReportsMembersTableHeaders"
      :items="reportData.members"
    />
    <ReportDataTable
      title="Time Entries"
      :headers="membersReportsTimeEntriesTableHeaders"
      :items="reportData.timeEntries"
    />
  </div>
</template>

<script lang="ts" setup>
import type { MembersReport } from "~/types";

type MembersReportDataTablesProps = {
  reportData?: MembersReport;
  fetching: boolean;
};

const props = defineProps<MembersReportDataTablesProps>();

const reportData = computed(() => {
  return prepareMembersReportsTableData(props.reportData);
});
</script>
