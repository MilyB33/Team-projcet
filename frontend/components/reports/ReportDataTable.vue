<template>
  <div class="d-flex flex-column ga-2">
    <h3>{{ title }}</h3>
    <v-data-table
      hide-default-footer
      :headers="headers"
      :items="items"
      height="250"
      sticky
    ></v-data-table>
  </div>
</template>

<script lang="ts" setup>
type ReportDataTableProps = {
  title: string;
  items: Record<string, unknown>[];
  headers: {
    title: string;
    key: string;
    sortable: boolean;
  }[];
};

defineProps<ReportDataTableProps>();
</script>
