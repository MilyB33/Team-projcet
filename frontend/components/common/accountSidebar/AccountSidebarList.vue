<template>
  <v-list
    density="compact"
    class="h-100 d-flex flex-column"
    nav
  >
    <v-list-item
      prepend-icon="mdi-account"
      title="Personal details"
      value="account"
    ></v-list-item>

    <v-btn
      class="mt-auto"
      prepend-icon="mdi-logout"
      color="red"
      @click="logout"
      >Log out</v-btn
    >
  </v-list>
</template>

<script lang="ts" setup>
const { logout } = useAuth();
</script>
