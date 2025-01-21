<template>
  <v-progress-linear
    :active="isLoading"
    :indeterminate="isLoading"
    absolute
    bottom
  >
  </v-progress-linear>
</template>

<script lang="ts" setup>
import { useIsFetching, useIsMutating } from "@tanstack/vue-query";

const isMutating = useIsMutating();
const isFetching = useIsFetching();

const isLoading = computed(() => !!isMutating.value || !!isFetching.value);
</script>
