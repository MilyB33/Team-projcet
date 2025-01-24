<template>
  <v-layout>
    <TopNavigation :toggleSidebar="toggleSidebar" />
    <Sidebar :isSidebarOpen="isSidebarOpen" />
    <v-main>
      <div
        class="pa-4 h-100"
        style="background-color: #e7ecef"
      >
        <slot />
      </div>
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
