<template>
  <Account />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
</script>
