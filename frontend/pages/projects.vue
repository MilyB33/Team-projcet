<template>
  <NuxtPage />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
</script>
