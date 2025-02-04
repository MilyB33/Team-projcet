<template>
  <NuxtLink
    v-bind="props"
    class="text-black"
    active-class="border-e-lg"
    style="border-color: black !important"
  >
    <v-btn
      class="w-100 justify-start"
      variant="text"
      :prepend-icon="icon"
    >
      <slot />
    </v-btn>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { NuxtLinkProps } from "#app";

type NavigationLinkProps = NuxtLinkProps & {
  icon: string;
};

const { icon, ...props } = defineProps<NavigationLinkProps>();
</script>
