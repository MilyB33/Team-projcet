<template>
  <v-list
    density="compact"
    nav
    class="d-flex flex-column ga-1"
  >
    <NuxtLink
      to="/"
      class="text-black"
    >
      <v-btn
        class="w-100 justify-start"
        variant="text"
        prepend-icon="mdi-home-city"
        >Home</v-btn
      >
    </NuxtLink>
    <NuxtLink
      to="/tracker"
      class="text-black"
    >
      <v-btn
        class="w-100 justify-start"
        variant="text"
        prepend-icon="mdi-clock-fast"
        >Time Tracker</v-btn
      >
    </NuxtLink>

    <NuxtLink
      to="/workspaces"
      class="text-black"
    >
      <v-btn
        class="w-100 justify-start"
        variant="text"
        prepend-icon="mdi-application-settings-outline"
        >Workspaces</v-btn
      >
    </NuxtLink>

    <v-btn
      class="w-100 justify-start"
      variant="text"
      prepend-icon="mdi-file"
      >My Projects</v-btn
    >
    <v-btn
      class="w-100 justify-start"
      variant="text"
      prepend-icon="mdi-chart-bar"
      >Reports</v-btn
    >
    <v-btn
      class="w-100 justify-start"
      variant="text"
      prepend-icon="mdi-account-group-outline"
      >Team</v-btn
    >
  </v-list>
</template>
