<template>
  <v-dialog
    max-width="300"
    v-model="dialog"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        icon="mdi-delete"
        size="small"
        variant="text"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        title="Deleting workspace"
        class="pa-4"
      >
        <h4>Are you sure you want to delete {{ name }} workspace?</h4>

        <div class="d-flex ga-2 justify-end mt-6">
          <v-btn
            color="red"
            :disabled="deletingWorkspace"
            @click="
              () => {
                isActive.value = false;
              }
            "
            >Close</v-btn
          >
          <v-btn
            @click="onDelete"
            :disabled="deletingWorkspace"
          >
            Confirm
          </v-btn>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
type ConfirmDeleteWorkspaceModalProps = {
  workspaceId: number;
  name: string;
};

const props = defineProps<ConfirmDeleteWorkspaceModalProps>();

const { deleteWorkspace, deletingWorkspace } = useWorkspaces();

const dialog = ref(false);

const onDelete = () => {
  deleteWorkspace(props.workspaceId);
};
</script>
