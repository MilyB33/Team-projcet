<template>
  <div class="d-flex flex-column ga-4 h-100">
    <h2>Users Report</h2>
    <UserReportFilters
      :memberItems="memberItems"
      :loading="loadingMembers"
      :setFilters="setFilters"
    />
    <UserReportDataTables
      :reportData="membersReport"
      :fetching="fetchingMembersReport"
    />
  </div>
</template>

<script lang="ts" setup>
const { memberItems, membersReport, loadingMembers, fetchingMembersReport, setFilters } =
  useMembersReport();
</script>
