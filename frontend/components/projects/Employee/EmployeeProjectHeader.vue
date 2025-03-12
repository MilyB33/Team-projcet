<template>
  <div class="d-flex flex-column ga-2">
    <div class="d-flex align-center">
      <h2>{{ project.name }} project</h2>

      <ConfirmDialog
        title="Leave project"
        text="Are you sure you want to leave this project?"
        :anchorProps="{ size: 'small', color: 'red', class: 'ml-auto', disabled: leavingProject }"
        anchorTitle="Leave project"
        :onConfirm="onLeave"
      >
      </ConfirmDialog>
    </div>

    <v-card class="d-flex ga-4 pa-4">
      <p>created at: {{ formattedCreatedAt }}</p>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { Project } from "~/types";
import moment from "moment";

type EmployerProjectHeaderProps = {
  project: Project;
};

const props = defineProps<EmployerProjectHeaderProps>();

const { leaveProject, leavingProject } = useProjects();

const onLeave = async () => {
  await leaveProject(props.project.id);
};

const formattedCreatedAt = moment(props.project.createdAt).format("MMMM Do YYYY"); // Format the date
</script>
