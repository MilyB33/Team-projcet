<template>
  <v-card class="mb-2">
    <v-tabs
      v-model="tab"
      bg-color="blue"
    >
      <NuxtLink
        class="text-white"
        to="/reports/summary"
        active-class="border-b-lg"
        style="border-color: white !important"
      >
        <v-tab value="one"> Summary </v-tab>
      </NuxtLink>
      <NuxtLink
        class="text-white"
        to="/reports/workspaces"
        active-class="border-b-lg"
        style="border-color: white !important"
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
      >
        <v-tab value="two">Users</v-tab>
      </NuxtLink>
    </v-tabs>
  </v-card>
</template>

<script></script>
