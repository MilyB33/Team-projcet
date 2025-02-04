<template>
  <EmployerProjects v-if="isEmployer" />
  <EmployeeProjects v-else />
</template>

<script lang="ts" setup>
const { isEmployer } = useUser();
</script>
