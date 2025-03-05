<script setup lang="ts">
import type RequestResetPasswordForm from "./RequestResetPasswordForm.vue";
</script>

<template>
  <div class="my-auto d-flex flex-column ga-4">
    <div>
      <div class="mb-4">
        <NuxtLink
          class="text-black text-decoration-none d-flex align-center ga-2"
          to="/login"
        >
          <v-icon>mdi-arrow-left</v-icon>
          <p>Go back to login</p>
        </NuxtLink>
      </div>
      <h4 class="text-h4 mb-2">Request reset password</h4>
      <v-divider :thickness="4"></v-divider>
    </div>

    <RequestResetPasswordForm />
  </div>
</template>
