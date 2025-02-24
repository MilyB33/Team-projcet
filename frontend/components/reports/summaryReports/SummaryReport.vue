<template>
  <EmployerSummaryReport v-if="isEmployer" />
  <EmployeeSummaryReport v-else />
</template>

<script lang="ts" setup>
const { isEmployer } = useUser();
</script>
