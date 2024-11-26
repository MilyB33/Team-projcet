<template>
  <slot />
  <v-snackbar
    v-model="show"
    :color="color"
  >
    {{ message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";

const show = ref(false);
const message = ref("");
const color = ref("");

provide("snackbar", {
  snackbar: {
    success: (_message: string) => {
      message.value = _message;
      color.value = "success";
      show.value = true;
    },
    error: (_message: string) => {
      message.value = _message;
      color.value = "error";
      show.value = true;
    },
  },

  hide() {
    show.value = false;
  },
});
</script>
