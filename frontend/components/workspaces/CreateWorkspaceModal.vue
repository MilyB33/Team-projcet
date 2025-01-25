<template>
  <v-dialog
    max-width="300"
    v-model="dialog"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        class="mt-4"
        v-bind="activatorProps"
        >Create workspace</v-btn
      >
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        title="Create new workspace"
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
              :disabled="creatingWorkspace"
              @click="
                () => {
                  isActive.value = false;
                }
              "
              >Close</v-btn
            >
            <v-btn
              type="submit"
              :disabled="creatingWorkspace"
              >Create</v-btn
            >
          </div>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
const form = useForm({ validationSchema: createWorkspaceSchemaTypedSchema });
const { value: name, errorMessage: nameError } = useField<string>("name");

const { createWorkspace, creatingWorkspace } = useWorkspaces();
const { user } = useUser();

const dialog = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  if (!user.value?.id) return;

  try {
    await createWorkspace({ ...values, user_id: user.value.id });
    dialog.value = false;
  } catch (err) {
    dialog.value = false;
  }
});
</script>
