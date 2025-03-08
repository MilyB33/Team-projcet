<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        size="small"
        icon="mdi-account"
        variant="outlined"
        color="blue"
        v-bind="props"
      ></v-btn>
    </template>

    <v-list class="px-4 mt-2 text-center">
      <NuxtLink
        to="/account"
        class="text-black text-decoration-none"
      >
        <v-btn variant="text"> My account </v-btn>
      </NuxtLink>

      <v-divider
        :thickness="2"
        class="my-2"
      ></v-divider>

      <v-btn
        variant="text"
        @click="logout"
      >
        Log out
      </v-btn>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
const { logout } = useAuth();
</script>
