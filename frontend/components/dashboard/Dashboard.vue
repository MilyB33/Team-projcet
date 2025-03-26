<template>
  <div
    v-if="isEmployer"
    class="d-flex justify-center align-center flex-column ga-4 mt-8"
  >
    <h1>Welcome back {{ user?.first_name }}!</h1>
    <NuxtLink to="/projects">
      <v-btn>Go to projects</v-btn>
    </NuxtLink>
  </div>
  <EmployeeDashboard v-else />
</template>

<script lang="ts" setup>
const { isEmployer, user } = useUser();
</script>
