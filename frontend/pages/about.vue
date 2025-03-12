<template>
  <v-container>
    <v-card elevation="2" class="pa-5">
      <v-card-title class="text-h5">About Clocker</v-card-title>
      <v-card-text>
        <p>
          Clocker is a project management and time-tracking software designed to help users monitor their tasks efficiently.
        </p>
        <ul class="d-flex flex-column ga-2 pa-0 mt-2" style="list-style: none;">
          <li class="d-flex align-center ga-2">
            <v-icon>mdi-account-multiple</v-icon>
            <span>Manage projects assigned to users</span>
          </li>
          <li class="d-flex align-center ga-2">
            <v-icon>mdi-clock-outline</v-icon>
            <span>Track time spent on each project</span>
          </li>
          <li class="d-flex align-center ga-2">
            <v-icon>mdi-chart-bar</v-icon>
            <span>Generate reports for better insights</span>
          </li>
        </ul>
      </v-card-text>
    </v-card>

    <v-card elevation="2" class="pa-5 mt-5">
      <v-card-title class="text-h5">Frequently Asked Questions</v-card-title>
      <v-expansion-panels>
        <v-expansion-panel v-for="(faq, index) in faqs" :key="index">
          <v-expansion-panel-title>{{ faq.question }}</v-expansion-panel-title>
          <v-expansion-panel-text>{{ faq.answer }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script>

export default {
  name: "AboutClocker",
  setup() {
    const faqs = ref([
      {
        question: "How can I add projects?",
        answer:
          "Go to the 'Projects' tab from the left panel and click the 'Create Projects' button. Fill in the required details and then click 'Create' to add the project.",
      },
      {
        question: "How can I view project reports?",
        answer:
          "Navigate to the 'Reports' tab from the left panel, then select the 'Projects' section. Choose a date range using the 'Select dates' button and apply filters with 'Apply Filters' to view the filtered project list.",
      },
      {
        question: "How can I start tracking work time on a project?",
        answer:
          "Go to the 'Time Tracker' tab from the left panel, enter the task description, and select the project from the list. Click 'Start' to begin tracking time. When you finish, click 'Stop' to log the task in the list.",
      },
    ]);

    return {
      faqs,
    };
  },
};
</script>
