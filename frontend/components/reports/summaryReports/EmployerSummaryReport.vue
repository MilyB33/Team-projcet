<template>
  <div class="d-flex">
    <div
      v-if="loadingSummary"
      class="mx-auto"
    >
      <v-progress-circular
        indeterminate
        :size="128"
        :width="12"
      ></v-progress-circular>
    </div>

    <div
      class="d-flex ga-4 flex-column w-100"
      v-if="employerSummary"
    >
      <div class="mx-auto d-flex ga-4">
        <v-card class="pa-4 text-center">
          <h3>Total Workspaces</h3>
          <p class="text-h3">{{ employerSummary.totalWorkspaces }}</p>
        </v-card>

        <v-card class="pa-4 text-center">
          <h3>Total Projects</h3>
          <p class="text-h3">{{ employerSummary.totalProjects }}</p>
        </v-card>

        <v-card class="pa-4 text-center">
          <h3>Total employees</h3>
          <p class="text-h3">{{ employerSummary.totalEmployees }}</p>
        </v-card>
      </div>

      <div class="mx-auto d-flex ga-4">
        <v-card
          class="pa-4 overflow-auto"
          max-height="500"
        >
          <h3 class="text-center">Your workspaces</h3>

          <v-list>
            <v-list-item v-for="workspaces in employerSummary.workspaces">
              <div class="workspace">
                <h2>{{ workspaces.name }}</h2>
                <p>Projects:{{ workspaces.projectsCount }}</p>
              </div>
              <v-divider :thickness="4" />
            </v-list-item>
          </v-list>
        </v-card>

        <v-card
          class="pa-4 overflow-auto"
          max-height="500"
          max-width="400"
        >
          <h3 class="text-center">Your Projects</h3>

          <v-list>
            <v-list-item v-for="project in employerSummary.projects">
              <div class="project">
                <h2>{{ project.name }}</h2>
                <p>{{ project.description }}</p>
              </div>
              <v-divider :thickness="4" />
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { loadingSummary, employerSummary } = useSummaryReport();
</script>

<style lang="scss" scoped>
.workspace {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
}

.project {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
