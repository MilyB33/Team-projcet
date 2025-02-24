<template>
  <EmployerProjectReport v-if="isEmployer" />
  <EmployeeProjectsReport v-else />
</template>

<script lang="ts" setup>
const { isEmployer } = useUser();
</script>
