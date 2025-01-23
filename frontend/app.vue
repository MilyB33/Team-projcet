<script setup lang="ts"></script>

<template>
  <v-app>
    <SnackbarProvider>
      <AppWrapper>
        <NuxtLayout>
          <NuxtRouteAnnouncer />
          <NuxtPage />
        </NuxtLayout>
      </AppWrapper>
    </SnackbarProvider>
  </v-app>
</template>
