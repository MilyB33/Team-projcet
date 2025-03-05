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
      v-if="employeeSummary"
    >
      <div class="mx-auto d-flex ga-4">
        <v-card class="pa-4 text-center">
          <h3>Total Projects</h3>
          <p class="text-h3">{{ employeeSummary.totalProjects }}</p>
        </v-card>

        <v-card class="pa-4 text-center">
          <h3>Total Time Entries</h3>
          <p class="text-h3">{{ employeeSummary.totalEntriesCount }}</p>
        </v-card>

        <v-card class="pa-4 text-center">
          <h3>Total Time</h3>
          <p class="text-h3">{{ employeeSummary.totalTime }}</p>
        </v-card>

        <v-card class="pa-4 text-center">
          <h3>Last week</h3>
          <p class="text-h3">{{ employeeSummary.totalTimeLastWeek }}</p>
        </v-card>

        <v-card class="pa-4 text-center">
          <h3>Last month</h3>
          <p class="text-h3">{{ employeeSummary.totalTimeLastMonth }}</p>
        </v-card>
      </div>

      <div class="mx-auto d-flex ga-4">
        <v-card
          class="pa-4 overflow-auto"
          max-height="500"
        >
          <h3 class="text-center">Projects</h3>

          <v-list>
            <v-list-item v-for="project in employeeSummary.totalTimePerProject">
              <div class="project">
                <p>{{ project.projectName }}</p>
                <p>{{ project.totalTime }}</p>
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
          <h3 class="text-center">Latest Time Entries</h3>

          <v-list>
            <v-list-item v-for="entry in employeeSummary.timeEntries.slice(0, 3)">
              <div class="project">
                <p>{{ entry.description }}</p>
                <p>{{ entry.totalTime }}</p>
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
const { loadingSummary, employeeSummary } = useSummaryReport();
console.log(employeeSummary.value);
</script>

<style lang="scss" scoped>
.project {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
}
</style>
