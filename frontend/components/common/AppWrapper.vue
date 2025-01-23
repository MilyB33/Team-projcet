<template>
  <div
    class="w-100 h-100 d-flex align-center justify-center"
    v-if="isLoading"
  >
    <v-progress-circular
      indeterminate
      :size="128"
      :width="12"
    ></v-progress-circular>
  </div>

  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts" setup>
const { isLoading } = useInitialize();
</script>
