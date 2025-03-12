<template>
  <v-dialog
    max-width="500px"
    v-model="modal"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="{ ...activatorProps }"
        icon="mdi-pencil"
        size="small"
        variant="text"
      >
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="pa-4">
        <v-card-title>Edit Task</v-card-title>
        <form @submit.prevent="onSubmit">
          <v-text-field
            v-model="description"
            :error-messages="descriptionError"
            label="Task Description"
            variant="outlined"
            :disabled="isUpdatingEntry"
          />
          <v-select
            v-model="project"
            :error-messages="projectError"
            :items="projectItems"
            label="Select Project"
            variant="outlined"
            :disabled="isUpdatingEntry"
          />
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="startTime"
                :error-messages="startTimeError"
                label="Start Time"
                type="datetime-local"
                variant="outlined"
                :disabled="isUpdatingEntry"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="endTime"
                :error-messages="endTimeError"
                label="End Time"
                type="datetime-local"
                variant="outlined"
                :disabled="isUpdatingEntry"
              />
            </v-col>
          </v-row>

          <v-card-actions>
            <v-btn
              type="submit"
              color="green"
              :disabled="isUpdatingEntry"
              >Save</v-btn
            >
            <v-btn
              @click="() => (isActive.value = false)"
              color="black"
              :disabled="isUpdatingEntry"
              >Cancel</v-btn
            >
          </v-card-actions>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { TimeEntry } from "~/types";
import moment from "moment";

type EditTimeEntryProps = {
  timeEntry: TimeEntry;
  projectId: number;
};

const props = defineProps<EditTimeEntryProps>();
const modal = ref(false);

const { updateEntry, isUpdatingEntry } = useTimeEntries();
const { projects } = useProjects();
const form = useForm({ validationSchema: editTimeEntryTypedSchema });
const { value: project, errorMessage: projectError } = useField<number>("project");
const { value: description, errorMessage: descriptionError } = useField<string>("description");
const { value: startTime, errorMessage: startTimeError } = useField<string>("startTime");
const { value: endTime, errorMessage: endTimeError } = useField<string>("endTime");

const onSubmit = form.handleSubmit(async (values) => {
  await updateEntry({
    description: values.description,
    projectId: values.project,
    startTime: new Date(values.startTime),
    endTime: new Date(values.endTime),
    entryId: props.timeEntry.id,
  });
  modal.value = false;
});

const projectItems = computed(() => {
  return (
    projects.value?.map((project) => ({
      value: project.id,
      title: project.name,
    })) || []
  );
});

onMounted(() => {
  form.setValues({
    project: props.projectId,
    description: props.timeEntry.description,
    startTime: moment(props.timeEntry.startTime).format("YYYY-MM-DDTHH:mm"),
    endTime: moment(props.timeEntry.endTime).format("YYYY-MM-DDTHH:mm"),
  });
});
</script>
