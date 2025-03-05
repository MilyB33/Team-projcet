<template>
  <div v-if="isEmployer"></div>
  <EmployeeDashboard v-else />
</template>

<script lang="ts" setup>
const { isEmployer } = useUser();
</script>
