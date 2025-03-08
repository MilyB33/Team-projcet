<template>
  <form
    class="d-flex flex-column ga-4"
    @submit.prevent="onSubmit"
  >
    <v-text-field
      label="Email"
      variant="outlined"
      v-model="email"
      :error-messages="emailError"
    ></v-text-field>

    <v-btn
      type="submit"
      color="pink"
      :disabled="isRequestingPasswordReset"
      >Request</v-btn
    >
  </form>
</template>

<script lang="ts" setup>
const form = useForm({ validationSchema: requestResetPasswordTypedSchema });
const { value: email, errorMessage: emailError } = useField<string>("email");

const { requestPasswordReset, isRequestingPasswordReset } = useAuth();

const onSubmit = form.handleSubmit((values) => {
  requestPasswordReset(values.email);
});
</script>
