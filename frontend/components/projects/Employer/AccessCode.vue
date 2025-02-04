<template>
  <div class="d-flex ga-2 align-center">
    <v-btn
      icon="mdi-refresh"
      variant="plain"
      size="small"
    ></v-btn>

    <v-divider vertical></v-divider>

    <v-btn
      @click="onCopy"
      variant="plain"
      size="small"
      prepend-icon="mdi-clipboard"
    >
      {{ code }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
type CopyCodeToClipboardProps = {
  code: string;
};

const props = defineProps<CopyCodeToClipboardProps>();

const { snackbar } = useSnackbar();

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    snackbar.success("Code copied");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
</script>
