<template>
  <v-select
    label="Workspace"
    :items="items"
    density="compact"
    :disabled="loading"
    variant="outlined"
    v-model="value"
    :error-messages="errorMessage"
    item-value="value"
    item-title="title"
    hide-details
    max-width="300"
    multiple
  >
    <template v-slot:selection="{ item, index }">
      <span v-if="index < 1">{{ item.title }}</span>

      <span
        v-if="index === 1"
        class="text-grey text-caption align-self-center"
      >
        (+{{ value.length - 2 }} others)
      </span>
    </template>

    <template v-slot:item="{ props, item }">
      <v-list-item
        v-bind="props"
        :disabled="value?.length === 1 && value?.includes(item.value)"
      >
        <template v-slot:append>
          <v-icon v-if="value?.includes(item.value)"> mdi-check </v-icon>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts" setup>
type IdFilterFieldProps = {
  items: { title: string; value: number }[];
  loading: boolean;
  fieldId: string;
};

const props = defineProps<IdFilterFieldProps>();

const { value, errorMessage } = useField<number[]>(props.fieldId);
</script>
