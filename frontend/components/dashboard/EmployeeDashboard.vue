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
      class="d-flex align-center ga-4 flex-column w-100"
      v-if="employeeSummary"
    >
      <div class="mb-4">
        <NuxtLink to="/tracker">
          <v-btn
            color="blue"
            size="large"
            >Start your work now</v-btn
          >
        </NuxtLink>
      </div>

      <v-card class="d-flex align-center ga-4 flex-column pa-4">
        <h3>Your summary from last week</h3>

        <div>
          <v-card class="pa-4 text-center">
            <h3>Your time</h3>
            <p class="text-h3">{{ employeeSummary.totalTimeLastWeek }}</p>
          </v-card>
        </div>

        <div class="mx-auto d-flex ga-4">
          <v-card class="pa-4 text-center">
            <h3>Total Projects</h3>
            <p class="text-h3">{{ employeeSummary.totalProjectsWorkedLastWeek }}</p>
          </v-card>

          <v-card class="pa-4 text-center">
            <h3>Total Time Entries</h3>
            <p class="text-h3">{{ employeeSummary.totalTimeEntriesLastWeek }}</p>
          </v-card>
        </div>
      </v-card>

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

                <NuxtLink
                  to="/"
                  class="text-black"
                >
                  <v-btn variant="plain">Go to</v-btn>
                </NuxtLink>
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
</script>

<style lang="scss" scoped>
.project {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
}
</style>
