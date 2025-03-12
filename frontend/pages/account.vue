<template>
  <NuxtPage />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "account",
  middleware: "auth",
});
</script>
