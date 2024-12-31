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

    <v-text-field
      label="Password"
      variant="outlined"
      :type="fieldType"
      hint="Enter a strong password"
      v-model="password"
      :error-messages="passwordError"
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
      :disabled="isLogging"
      >Log in</v-btn
    >

    <p class="text-subtitle-2">
      Don't have an account?
      <NuxtLink
        class="text-black"
        to="/create-account"
      >
        Create one now!
      </NuxtLink>
    </p>
  </form>
</template>

<script lang="ts" setup>
import { useMutation } from "@tanstack/vue-query";
import type { LoginRequest, LoginResponse } from "~/types";

const isPasswordVisible = ref(false);

const form = useForm({ validationSchema: signInTypedSchema });
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } = useField<string>("password");

const { client, setAuthToken } = useAxiosClient();
const { snackbar } = useSnackbar();

const { mutate: login, isPending: isLogging } = useMutation({
  mutationFn: async (data: LoginRequest): Promise<LoginResponse> =>
    (await client.post("http://localhost:9000/api/auth/login/", data)).data,
  onSuccess: (response) => {
    snackbar.success("Successfully logged in!");
    setAuthToken(response.accessToken);
    navigateTo("/");
  },
  onError: (error) => {
    snackbar.error(error.message || "Something went wrong!");
  },
});

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const onSubmit = form.handleSubmit((values) => {
  login(values);
});

const fieldType = computed(() => {
  return isPasswordVisible.value ? "text" : "password";
});

const buttonIcon = computed(() => {
  return isPasswordVisible.value ? "mdi-eye-off-outline" : "mdi-eye-outline";
});
</script>
