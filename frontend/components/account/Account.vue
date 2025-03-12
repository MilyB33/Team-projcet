<template>
  <v-container
    width="100%"
    fluid
    class="pa-5"
  >
    <v-card
      class="pa-5"
      outlined
    >
      <v-card-title>Personal Details</v-card-title>
      <v-card-text>
        <v-form @submit="onSubmit">
          <v-text-field
            label="Account Type"
            v-model="accountType"
            variant="outlined"
            disabled
          ></v-text-field>
          <div class="name d-flex ga-4 mt-2 mb-2">
            <v-text-field
              label="First Name"
              v-model="firstName"
              variant="outlined"
              :error-messages="firstNameError"
            ></v-text-field>
            <v-text-field
              label="Last Name"
              v-model="lastName"
              variant="outlined"
              :error-messages="lastNameError"
            ></v-text-field>
          </div>
          <v-text-field
            label="Email Address"
            v-model="email"
            variant="outlined"
            :error-messages="emailError"
            type="email"
          ></v-text-field>
          <v-text-field
            v-if="isEmployer"
            label="Company name"
            v-model="company"
            :error-messages="companyError"
            variant="outlined"
          ></v-text-field>
          <v-btn
            color="blue"
            class="mt-3"
            type="submit"
            :disabled="updatingUser"
            :loading="updatingUser"
            >Save Changes</v-btn
          >
          <v-btn
            color="primary"
            class="mt-3 ml-3"
            @click="onRequestPasswordChange"
            >Reset Password</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { type User } from "~/types";

const { user, isEmployer, updateUser, updatingUser } = useUser();
const { requestPasswordReset } = useAuth();

const accountType = computed(() => {
  return isEmployer ? "Employer" : "Standard";
});

const form = useForm({
  validationSchema: isEmployer.value
    ? updateEmployerAccountDetailsTypedSchema
    : updateStandardAccountDetailsTypedSchema,
});
const { value: firstName, errorMessage: firstNameError } = useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: email, errorMessage: emailError } = useField("email");
const { value: company, errorMessage: companyError } = useField("company");

const onRequestPasswordChange = () => {
  if (user.value) {
    requestPasswordReset(user.value?.email);
  }
};

const onSubmit = form.handleSubmit(async (values) => {
  await updateUser({
    first_name: values.firstName,
    last_name: values.lastName,
    email: values.email,
    // @ts-ignore
    company: values.company,
  });
});

const setInitialValues = (user: User) => {
  form.setValues({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  });

  if (user.typeId === 2) {
    form.setValues({
      // @ts-ignore
      company: user.company,
    });
  }
};

watch(user, (newUser) => {
  if (newUser) {
    setInitialValues(newUser);
  }
});

onMounted(() => {
  if (user.value) {
    setInitialValues(user.value);
  }
});
</script>
