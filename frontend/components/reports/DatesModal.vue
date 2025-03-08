<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <div>
        <v-btn
          v-bind="activatorProps"
          :text="btnText"
          :color="!!errorMessage ? 'red' : 'blue'"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="d-flex flex-column align-center justify-center pa-2">
        <v-date-picker
          title="Dates range"
          header="Select dates"
          v-model="value"
          :multiple="2"
        ></v-date-picker>

        <p class="text-subtitle-2 text-red">{{ errorMessage }}</p>

        <v-btn
          class="ml-auto"
          @click="
            () => {
              isActive.value = false;
            }
          "
          >Close</v-btn
        >
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import moment from "moment";

const { value, errorMessage } = useField<Date[] | undefined>("datesRange");

const btnText = computed(() => {
  if (value.value && value.value.length === 2) {
    return `${moment(value.value[0]).format("MMM DD YYYY")} - ${moment(value.value[1]).format("MMM DD YYYY")}`; // Format dates
  } else {
    return "Select dates";
  }
});
</script>
