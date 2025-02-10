<template>
  <v-dialog
    max-width="600"
    v-model="dialog"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps">Create Project</v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        title="Create new project"
        class="pa-2"
      >
        <form @submit.prevent="onSubmit">
          <v-text-field
            placeholder="Project name"
            variant="outlined"
            density="compact"
            v-model="name"
            :error-messages="nameError"
          ></v-text-field>

          <v-textarea
            placeholder="Description"
            variant="outlined"
            density="compact"
            v-model="description"
            :error-messages="descriptionError"
          ></v-textarea>

          <v-select
            placeholder="Select workspace"
            variant="outlined"
            density="compact"
            :items="workspacesItems"
            v-model="workspace"
            :error-messages="workspaceError"
          ></v-select>

          <v-combobox
            placeholder="Add groups (default group will be created automatically)"
            variant="outlined"
            density="compact"
            chips
            multiple
            v-model="groups"
            :error-messages="groupsError"
          ></v-combobox>

          <div class="d-flex ga-2 justify-end">
            <v-btn
              color="red"
              :disabled="creatingProject"
              @click="
                () => {
                  isActive.value = false;
                }
              "
              >Close</v-btn
            >
            <v-btn
              type="submit"
              :disabled="creatingProject"
              >Create</v-btn
            >
          </div>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Workspace } from "~/types";

type CreateProjectModalProps = {
  workspaces: Workspace[];
};

const props = defineProps<CreateProjectModalProps>();

const workspacesItems = computed(() => prepareWorkspacesItems(props.workspaces));

const form = useForm({ validationSchema: createProjectTypedSchema });
const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: description, errorMessage: descriptionError } = useField<string>("description");
const { value: workspace, errorMessage: workspaceError } = useField<number>("workspace");
const { value: groups, errorMessage: groupsError } = useField<string[]>("groups");

const { createProject, creatingProject } = useProject();
const { user } = useUser();

const dialog = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  if (!user.value?.id) return;

  const data = prepareCreateProjectData(values);

  try {
    await createProject({ ...data });
    dialog.value = false;
  } catch (err) {
    dialog.value = false;
  }
});
</script>
