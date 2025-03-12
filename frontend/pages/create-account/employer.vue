<template>
  <EmployerAccount />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
</script>
