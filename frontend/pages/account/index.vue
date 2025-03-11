<template>
  <v-container fluid class="pa-5">
    <v-card class="pa-5" outlined>
      <v-card-title>Personal Details</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Account Type" v-model="accountType" variant="outlined" disabled></v-text-field>
          <div class="name d-flex ga-4 mt-2 mb-2">
            <v-text-field label="First Name" v-model="firstName" variant="outlined" :error-messages="firstNameError" :rules="[maxLengthRule]" counter="64" maxlength="64"></v-text-field>
            <v-text-field label="Last Name" v-model="lastName" variant="outlined" :error-messages="lastNameError" :rules="[maxLengthRule]" counter="64" maxlength="64"></v-text-field>
          </div>
          <v-text-field label="Email Address" v-model="email" variant="outlined" :error-messages="emailError" type="email" :rules="[maxLengthRule]" counter="64" maxlength="64"></v-text-field>
          <v-btn color="success" class="mt-3" @click="saveChanges">Save Changes</v-btn>
          <v-btn color="primary" class="mt-3 ml-3" @click="resetPassword">Reset Password</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const form = useForm({ validationSchema: personalDetailsTypedSchema });
const { value: firstName, errorMessage: firstNameError } = useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: email, errorMessage: emailError } = useField("email");
const accountType = ref("IT engineer");

const resetPassword = () => {
  alert('Password reset link sent to email!');
};

const saveChanges = () => {
  if (firstNameError.value || lastNameError.value || emailError.value || !firstName.value || !lastName.value || !email.value) {
    alert('The changes could not be saved. Required fields are empty or contain invalid data.');
    return;
  }
  alert('Changes saved successfully!');
};

</script>

<style scoped>
.v-container {
  width: 100%;
  margin: 0;
  padding-left: 0;
}
</style>
