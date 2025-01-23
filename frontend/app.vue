<script setup lang="ts"></script>

<template>
  <v-app>
    <SnackbarProvider>
      <AxiosProvider>
        <AppWrapper>
          <NuxtLayout>
            <NuxtRouteAnnouncer />
            <NuxtPage />
          </NuxtLayout>
        </AppWrapper>
      </AxiosProvider>
    </SnackbarProvider>
  </v-app>
</template>
