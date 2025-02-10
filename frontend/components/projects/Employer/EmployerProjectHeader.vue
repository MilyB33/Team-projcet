<template>
  <div class="d-flex flex-column ga-2">
    <div class="d-flex align-center">
      <h2>{{ project.name }} project</h2>

      <ConfirmDialog
        title="Delete project"
        text="Are you sure you want to delete this project?"
        :anchorProps="{ size: 'small', color: 'red', class: 'ml-auto', disabled: deletingProject }"
        anchorTitle="Delete project"
        :onConfirm="onDelete"
      >
      </ConfirmDialog>
    </div>

    <v-card class="d-flex ga-4 pa-4">
      <p>workspace: {{ project.workspace.name }}</p>
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

const { deleteProject, deletingProject } = useProject();
const router = useRouter();

const onDelete = () => {
  deleteProject(props.project.id);
  router.push("/projects");
};
const formattedCreatedAt = moment(props.project.createdAt).format("MMMM Do YYYY"); // Format the date
</script>
