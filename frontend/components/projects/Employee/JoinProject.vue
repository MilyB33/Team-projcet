<template>
  <form
    class="d-flex w-100 align-center ga-4"
    @submit="onSubmit"
  >
    <v-text-field
      variant="outlined"
      density="compact"
      placeholder="Access code"
      hide-details
      width="150"
      :disabled="isJoiningProject"
      v-model="accessCode"
      :error-messages="accessCodeError"
    ></v-text-field>
    <v-btn
      type="submit"
      :disabled="form.isSubmitting.value || isAccessCodeEmpty || isJoiningProject"
    >
      Join
    </v-btn>
  </form>
</template>

<script lang="ts" setup>
type JoinProjectProps = {
  afterSubmit?: () => void;
};

const props = defineProps<JoinProjectProps>();

const form = useForm({ validationSchema: joinProjectTypedSchema });

const { value: accessCode, errorMessage: accessCodeError } = useField("accessCode");

const { joinProject, isJoiningProject } = useProjects();

const isAccessCodeEmpty = computed(() => {
  return !form.values.accessCode?.length;
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await joinProject(values);
    props.afterSubmit?.();
  } catch (error) {
    console.error();
  }
});
</script>
