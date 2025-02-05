<template>
  <form
    @submit="onSubmit"
    class="d-flex flex-column"
  >
    <div class="d-flex ga-4 justify-space-between">
      <v-text-field
        readonly
        label="Project access code"
        id="project-access-code"
        name="project-access-code"
        density="compact"
        variant="outlined"
        min-width="200"
        max-width="200"
        prepend-inner-icon="mdi-clipboard"
        append-inner-icon="mdi-refresh"
        @click:prepend-inner="onCopy"
        @click:append-inner="onGenerateAccessCode"
        :disabled="generatingAccessCode"
        v-model="accessCode"
        :error-messages="accessCodeError"
      ></v-text-field>
      <v-text-field
        label="Project name"
        id="project-name"
        name="project-name"
        density="compact"
        variant="outlined"
        class="w-100"
        v-model="name"
        :error-messages="nameError"
      ></v-text-field>
    </div>

    <v-textarea
      label="Project description"
      id="project-description"
      name="project-description"
      variant="outlined"
      density="compact"
      v-model="description"
      :error-messages="descriptionError"
    ></v-textarea>

    <v-btn
      color="blue"
      class="ml-auto"
      type="submit"
      :disabled="updatingProject"
      >Save</v-btn
    >
  </form>
</template>

<script lang="ts" setup>
import type { Project } from "~/types";

type EmployerProjectEditProps = {
  project: Project;
};

const props = defineProps<EmployerProjectEditProps>();

const { generateAccessCode, updateProject, generatingAccessCode, updatingProject } = useProject();
const { snackbar } = useSnackbar();

const form = useForm({
  validationSchema: editProjectTypedSchema,
  initialValues: {
    name: props.project.name,
    accessCode: props.project.accessCode,
    description: props.project.description,
  },
});

const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: accessCode, errorMessage: accessCodeError } = useField<string>("accessCode");
const { value: description, errorMessage: descriptionError } = useField<string>("description");

watch(
  () => props.project.accessCode,
  (newValue) => {
    form.setFieldValue("accessCode", newValue);
  },
);

const onGenerateAccessCode = () => {
  generateAccessCode(props.project.id);
};

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.project.accessCode);
    snackbar.success("Code copied");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const onSubmit = form.handleSubmit((values) => {
  updateProject({ ...values, id: props.project.id });
});
</script>
