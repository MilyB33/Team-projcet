<template>
  <v-dialog max-width="500px">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="{ ...activatorProps, ...anchorProps }"
        v-if="anchorTitle"
      >
        {{ anchorTitle }}
      </v-btn>

      <v-btn
        v-bind="{ ...activatorProps, ...anchorProps }"
        v-else
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="pa-4 d-flex flex-col ga-2">
        <h3>{{ title }}</h3>
        <p>{{ text }}</p>

        <div class="mt-6 d-flex ga-2 ml-auto">
          <v-btn
            size="small"
            color="black"
            @click="() => (isActive.value = false)"
            >Cancel</v-btn
          >
          <v-btn
            size="small"
            color="blue"
            @click="onConfirm"
            >Confirm</v-btn
          >
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { VBtn } from "vuetify/components";

type ConfirmDialogProps = {
  title: string;
  text: string;
  onConfirm: () => void;
  anchorTitle?: string;
  anchorProps?: VBtn["$props"];
};

defineProps<ConfirmDialogProps>();
</script>
