<template>
  <v-list
    density="compact"
    nav
    class="d-flex flex-column ga-1"
  >
    <NavigationLink
      icon="mdi-home-city"
      to="/"
    >
      Home
    </NavigationLink>

    <NavigationLink
      icon="mdi-clock-fast"
      to="/tracker"
      v-if="!isEmployer"
    >
      Time tracker
    </NavigationLink>

    <NavigationLink
      icon="mdi-application-settings-outline"
      to="/workspaces"
      v-if="isEmployer"
    >
      Workspaces
    </NavigationLink>

    <NavigationLink
      icon="mdi-file"
      to="/projects"
    >
      My Projects
    </NavigationLink>

    <NavigationLink
      icon="mdi-chart-bar"
      to="/reports"
    >
      Reports
    </NavigationLink>
  </v-list>
</template>

<script lang="ts" setup>
const { isEmployer } = useUser();
</script>
