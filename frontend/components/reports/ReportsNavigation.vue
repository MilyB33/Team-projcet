<template>
  <v-card class="mb-2">
    <v-tabs bg-color="blue">
      <NuxtLink
        class="text-white"
        to="/reports"
        exact-active-class="border-b-lg"
        style="border-color: white !important"
      >
        <v-tab value="one"> Summary </v-tab>
      </NuxtLink>
      <NuxtLink
        class="text-white"
        to="/reports/workspaces"
        active-class="border-b-lg"
        style="border-color: white !important"
        v-if="isEmployer"
      >
        <v-tab value="one"> Workspaces </v-tab>
      </NuxtLink>
      <NuxtLink
        class="text-white"
        to="/reports/projects"
        active-class="border-b-lg"
        style="border-color: white !important"
      >
        <v-tab value="one"> Projects </v-tab>
      </NuxtLink>
      <NuxtLink
        class="text-white"
        to="/reports/users"
        active-class="border-b-lg"
        style="border-color: white !important"
        v-if="isEmployer"
      >
        <v-tab value="two">Users</v-tab>
      </NuxtLink>
    </v-tabs>
  </v-card>
</template>

<script lang="ts" setup>
const { isEmployer } = useUser();
</script>
