<template>
  <v-navigation-drawer
    :permanent="!mobile"
    v-model:model-value="isOpen"
  >
    <SidebarList />
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

type SidebarProps = {
  isSidebarOpen: boolean;
};

const props = defineProps<SidebarProps>();

const isOpen = computed(() => props.isSidebarOpen || !mobile.value);

const { mobile } = useDisplay({ mobileBreakpoint: 830 });
</script>
