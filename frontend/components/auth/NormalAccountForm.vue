<template>
  <form
    class="d-flex flex-column ga-4"
    @submit.prevent="onSubmit"
  >
    <div class="d-flex ga-4">
      <v-text-field
        label="Name"
        variant="outlined"
        v-model="name"
        :error-messages="nameError"
      ></v-text-field>
      <v-text-field
        label="Surname"
        variant="outlined"
        v-model="surname"
        :error-messages="surnameError"
      ></v-text-field>
    </div>
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
      :loading="isLoading"
      :disabled="isLoading"
      >Create account</v-btn
    >

    <p class="text-subtitle-2">
      Already have an account?
      <NuxtLink
        class="text-black"
        to="/login"
      >
        Log in now!
      </NuxtLink>
    </p>
  </form>
</template>

<script lang="ts" setup>
import { useMutation } from "@tanstack/vue-query";
import type { CreateUserRequest, CreateUserResponse } from "~/types";

const isPasswordVisible = ref(false);

const form = useForm({ validationSchema: createRegularAccountTypedSchema });
const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: surname, errorMessage: surnameError } = useField<string>("surname");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } = useField<string>("password");

const { client } = useAxiosClient();
const { snackbar } = useSnackbar();

const { mutate: createAccount, isPending: isLoading } = useMutation({
  mutationFn: async (data: CreateUserRequest): Promise<CreateUserResponse> =>
    (await client.post("http://localhost:9000/api/users/", data)).data,
  onSuccess: () => {
    snackbar.success("Successfully created account!");
    navigateTo("/login");
  },
  onError: (error) => {
    snackbar.error(error.message || "Something went wrong!");
  },
});

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const onSubmit = form.handleSubmit((values) => {
  const validated = createRegularAccountSchema.safeParse(values);

  if (!validated.success) {
    console.log("Something went wrong!");
  }

  if (validated.data) {
    createAccount({
      first_name: validated.data.name,
      last_name: validated.data.surname,
      email: validated.data.email,
      password: validated.data.password,
      account_type: "standard",
    });
  }
});

const fieldType = computed(() => {
  return isPasswordVisible.value ? "text" : "password";
});

const buttonIcon = computed(() => {
  return isPasswordVisible.value ? "mdi-eye-off-outline" : "mdi-eye-outline";
});
</script>
