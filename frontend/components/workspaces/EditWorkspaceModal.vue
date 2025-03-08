<template>
  <v-dialog
    max-width="300"
    v-model="dialog"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        icon="mdi-pencil"
        size="small"
        variant="text"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        title="Edit workspace"
        class="pa-2"
      >
        <form @submit.prevent="onSubmit">
          <v-text-field
            placeholder="workspace name"
            variant="outlined"
            density="compact"
            v-model="name"
            :error-messages="nameError"
          ></v-text-field>

          <div class="d-flex ga-2 justify-end">
            <v-btn
              color="red"
              :disabled="updatingWorkspace"
              @click="
                () => {
                  isActive.value = false;
                }
              "
              >Close</v-btn
            >
            <v-btn
              type="submit"
              :disabled="updatingWorkspace"
              >Update</v-btn
            >
          </div>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
type EditWorkspaceModalProps = {
  workspaceId: number;
  name: string;
};

const props = defineProps<EditWorkspaceModalProps>();

const form = useForm({
  validationSchema: createWorkspaceSchemaTypedSchema,
  initialValues: { name: props.name },
});
const { value: name, errorMessage: nameError } = useField<string>("name");

const { updateWorkspace, updatingWorkspace } = useWorkspaces();

const dialog = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await updateWorkspace({ ...values, id: props.workspaceId });
    dialog.value = false;
  } catch (err) {
    dialog.value = false;
  }
});
</script>
