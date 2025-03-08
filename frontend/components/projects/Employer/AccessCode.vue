<template>
  <div class="d-flex ga-2 align-center">
    <v-btn
      icon="mdi-refresh"
      variant="plain"
      size="small"
      @click="onGenerate"
      :disabled="generatingAccessCode"
    ></v-btn>

    <v-divider vertical></v-divider>

    <v-btn
      @click="onCopy"
      variant="plain"
      size="small"
      prepend-icon="mdi-clipboard"
      :disabled="generatingAccessCode"
    >
      {{ code }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
type CopyCodeToClipboardProps = {
  code: string;
  id: number;
};

const props = defineProps<CopyCodeToClipboardProps>();

const { snackbar } = useSnackbar();
const { generateAccessCode, generatingAccessCode } = useProject();

const onGenerate = () => {
  generateAccessCode(props.id);
};

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    snackbar.success("Code copied");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
</script>
