<script setup lang="ts"></script>

<template>
  <v-app>
    <SnackbarProvider>
      <NuxtLayout>
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </NuxtLayout>
    </SnackbarProvider>
  </v-app>
</template>
