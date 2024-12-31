<template>
  <div class="my-auto">
    <h4 class="text-h6 mb-2">Choose account type you want to create</h4>
    <v-divider></v-divider>
    <div class="d-flex ga-4 mt-4">
      <NuxtLink
        to="/create-account/normal"
        class="w-100 text-decoration-none text-black"
        style="height: 200px"
      >
        <v-card
          class="pa-4 h-100 d-flex justify-center align-center text-center font-weight-bold"
          color="blue"
        >
          <span>Create normal account</span>
        </v-card>
      </NuxtLink>
      <NuxtLink
        to="/create-account/employer"
        class="w-100 text-decoration-none text-black"
        style="height: 200px"
      >
        <v-card
          class="pa-4 h-100 d-flex justify-center align-center text-center font-weight-bold"
          color="blue"
        >
          <span>Create employer account</span>
        </v-card>
      </NuxtLink>
    </div>

    <p class="mt-4 text-subtitle-2">
      Already have an account?
      <NuxtLink
        class="text-black"
        to="/login"
      >
        Log in now!
      </NuxtLink>
    </p>
  </div>
</template>
