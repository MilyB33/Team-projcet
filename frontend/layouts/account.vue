<template>
  <v-layout>
    <TopNavigation :toggleSidebar="toggleSidebar" />
    <AccountSidebar :isSidebarOpen="isSidebarOpen" />
    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const { mobile } = useDisplay({ mobileBreakpoint: 830 });

watch(mobile, () => {
  isSidebarOpen.value = false;
});
</script>
