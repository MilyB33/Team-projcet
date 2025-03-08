<template>
  <EmployerProject v-if="isEmployer" />
  <EmployeeProject v-else />
</template>

<script lang="ts" setup>
const { isEmployer } = useUser();
</script>
