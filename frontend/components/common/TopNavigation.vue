<template>
  <v-app-bar :elevation="2">
    <Progress />

    <template
      v-if="mobile"
      v-slot:prepend
    >
      <v-btn
        icon="mdi-menu"
        @click="toggleSidebar"
      ></v-btn
    ></template>

    <v-app-bar-title>
      <NuxtLink
        to="/"
        class="text-decoration-none"
      >
        <div class="d-flex align-center ga-2">
          <h3 class="text-blue">Clocker</h3>
          <v-icon
            color="blue"
            icon="mdi-clock-time-nine-outline"
          ></v-icon>
        </div>
      </NuxtLink>
    </v-app-bar-title>

    <div class="d-flex ga-2 px-2 align-center">
      <NuxtLink
        to="/about"
        >
      <v-btn
        icon="mdi-help"
        size="small"
        variant="plain"
      >
      </v-btn>
      </NuxtLink>
      <v-divider
        vertical
        :thickness="2"
      ></v-divider>

      <TopNavigationAccount />
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

type TopNavigationProps = {
  toggleSidebar: () => void;
};

defineProps<TopNavigationProps>();

const { mobile } = useDisplay({ mobileBreakpoint: 830 });
</script>
