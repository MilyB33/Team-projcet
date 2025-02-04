<template>
  <div class="d-flex flex-column ga-4 h-100">
    <h2>Project</h2>

    <div
      class="self-center mx-auto my-auto"
      v-if="loadingProject"
    >
      <v-progress-circular
        indeterminate
        :size="55"
        :width="9"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { project, loadingProject } = useProject();
</script>
