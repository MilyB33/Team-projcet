<template>
  <form
    class="d-flex flex-column ga-4"
    @submit.prevent="onSubmit"
  >
    <v-text-field
      label="New Password"
      variant="outlined"
      :type="fieldType"
      hint="Enter a strong password"
      v-model="newPassword"
      :error-messages="newPasswordError"
    >
      <template v-slot:append-inner>
        <v-btn
          :icon="buttonIcon"
          variant="plain"
          class="px-0"
          @click="togglePassword"
        />
      </template>
    </v-text-field>

    <v-btn
      type="submit"
      color="pink"
      :disabled="isResettingPassword"
      >Reset</v-btn
    >
  </form>
</template>

<script lang="ts" setup>
const isPasswordVisible = ref(false);

const route = useRoute();

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const form = useForm({ validationSchema: resetPasswordTypedSchema });
const { value: newPassword, errorMessage: newPasswordError } = useField<string>("newPassword");

const { resetPassword, isResettingPassword } = useAuth();

const onSubmit = form.handleSubmit((values) => {
  resetPassword({ token: route.query.token as string, newPassword: values.newPassword });
});

const fieldType = computed(() => {
  return isPasswordVisible.value ? "text" : "password";
});

const buttonIcon = computed(() => {
  return isPasswordVisible.value ? "mdi-eye-off-outline" : "mdi-eye-outline";
});
</script>
