<template>
  <v-container fluid class="pa-5">
    <v-card class="pa-5" outlined>
      <v-card-title>Personal Details</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="First Name" v-model="firstName" outlined :rules="[maxLengthRule]" counter="64" maxlength="64"></v-text-field>
          <v-text-field label="Last Name" v-model="lastName" outlined :rules="[maxLengthRule]" counter="64" maxlength="64"></v-text-field>
          <v-text-field label="Work Position" v-model="workPosition" outlined disabled></v-text-field>
          <v-text-field label="Email Address" v-model="email" outlined type="email" :rules="[maxLengthRule]" counter="64" maxlength="64"></v-text-field>
          <v-btn color="success" class="mt-3" @click="saveChanges">Save Changes</v-btn>
          <v-btn color="primary" class="mt-3 ml-3" @click="resetPassword">Reset Password</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const firstName = ref('');
const lastName = ref('');
const workPosition = ref('IT engineer');
const email = ref('');

const resetPassword = () => {
  alert('Password reset link sent to email!');
};

const saveChanges = () => {
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
