<template>
  <slot />
</template>

<script lang="ts" setup>
import { provide } from "vue";

const axiosClientContext = useInitializeAxiosClient();

provide("axiosClient", axiosClientContext);
</script>
