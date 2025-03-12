<template>
  <ReportsNavigation />
  <v-divider class="my-4" />
  <NuxtPage />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
</script>
