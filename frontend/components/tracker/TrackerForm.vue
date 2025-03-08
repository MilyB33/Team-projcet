<template>
  <form @submit.prevent="onSubmit">
    <div class="d-flex ga-4 align-center">
      <v-text-field
        label="What are you working on?"
        variant="outlined"
        hide-details
        v-model="description"
        :error-messages="descriptionError"
        :disabled="isLoading || isRunning"
      />

      <v-select
        label="Select Project"
        variant="outlined"
        hide-details
        v-model="project"
        :items="projectsItems"
        :error-messages="projectError"
        width="50"
        :disabled="isLoading || isRunning"
      />

      <div class="d-flex ga-3">
        <span class="mr-4">{{ formattedTimer }}</span>

        <v-btn
          :color="isRunning ? 'red' : 'green'"
          type="submit"
          :disabled="isLoading"
        >
          {{ isRunning ? "STOP" : "START" }}
        </v-btn>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
const timer = ref(0);
const isRunning = ref(false);
const timerId = ref<NodeJS.Timeout | null>(null);
const { projects, loadingProjects } = useProjects();
const {
  lastTimeEntry,
  loadingLastTimeEntry,
  creatingTimeEntry,
  endingTimeEntry,
  createEntry,
  endEntry,
} = useTimeEntries();

const isLoading = computed(() => {
  return (
    loadingProjects.value ||
    loadingLastTimeEntry.value ||
    creatingTimeEntry.value ||
    endingTimeEntry.value
  );
});

const projectsItems = computed(() => {
  return projects.value?.map((project) => ({
    value: project.id,
    title: project.name,
  }));
});

const form = useForm({ validationSchema: timerTypedSchema });
const { value: project, errorMessage: projectError } = useField("project");
const { value: description, errorMessage: descriptionError } = useField("description");

const formattedTimer = computed(() => {
  const hours = Math.floor(timer.value / 3600);
  const minutes = Math.floor((timer.value % 3600) / 60);
  const seconds = timer.value % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const startInterval = (startTime: Date) => {
  if (timerId.value) {
    clearInterval(timerId.value);
  }

  timerId.value = setInterval(() => {
    timer.value = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  }, 1000);
};

const startTimer = async (values: TimerSchemaValues) => {
  isRunning.value = true;

  const startTime = new Date();

  await createEntry({
    description: values.description,
    projectId: values.project,
    startTime,
  });

  startInterval(startTime);
};

const stopTimer = async () => {
  isRunning.value = false;

  if (lastTimeEntry.value?.id) {
    await endEntry(lastTimeEntry.value.id);

    if (timerId.value) {
      clearInterval(timerId.value);
      timer.value = 0;
      form.handleReset();
    }
  }
};

const onSubmit = form.handleSubmit((values) => {
  if (isRunning.value) {
    stopTimer();
  } else {
    startTimer(values);
  }
});

watch(lastTimeEntry, (newEntry) => {
  if (newEntry && newEntry.id && !newEntry.endTime) {
    form.setValues({
      description: newEntry?.description,
      project: newEntry?.projectUser.projectId,
    });

    isRunning.value = true;

    timer.value = new Date(newEntry?.startTime).getDate();

    startInterval(new Date(newEntry.startTime));
  }
});
</script>
