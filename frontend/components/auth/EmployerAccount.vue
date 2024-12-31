<template>
  <div class="my-auto d-flex flex-column ga-4">
    <div>
      <h4 class="text-h4">Create account</h4>
      <v-divider
        class="my-2"
        :thickness="4"
      ></v-divider>

      <v-btn
        prepend-icon="mdi-arrow-left-thin"
        @click="$router.go(-1)"
        variant="text"
        >Go back</v-btn
      >
    </div>

    <EmployerAccountForm />
  </div>
</template>
