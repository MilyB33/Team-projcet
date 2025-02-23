<template>
  <v-card>
    <form
      class="d-flex align-center ga-4 ma-0 pa-2"
      @submit="onSubmit"
    >
      <slot :form="form"> </slot>

      <DatesModal />

      <v-divider vertical></v-divider>

      <v-btn
        color="black"
        @click="onClearFilters"
      >
        Clear filters
      </v-btn>

      <v-btn
        type="submit"
        class="ml-auto"
        >Apply filters</v-btn
      >
    </form>
  </v-card>
</template>

<script lang="ts" setup>
import moment from "moment";

type MappedValues = Omit<ReportsFiltersSchemaValues, "dateRange"> & {
  startDate?: string;
  endDate?: string;
};

type ReportsFiltersProps = {
  onSubmit: (values: MappedValues) => void;
  initialValues?: Partial<ReportsFiltersSchemaValues>;
};

const props = defineProps<ReportsFiltersProps>();

const form = useForm({
  validationSchema: reportsFiltersTypedSchema,
  initialValues: props.initialValues,
});

watchEffect(() => {
  if (
    props.initialValues?.workspaceId?.length ||
    props.initialValues?.projectId?.length ||
    props.initialValues?.memberId?.length
  ) {
    form.setValues(props.initialValues);
  }
});

const onClearFilters = () => {
  form.setValues({ workspaceId: props.initialValues?.workspaceId, datesRange: [] });
  props.onSubmit(form.values);
};

const onSubmit = form.handleSubmit((values) => {
  let startDate: string | undefined;
  let endDate: string | undefined;

  if (values.datesRange && values.datesRange.length === 2) {
    const [date1, date2] = values.datesRange;
    const sortedDates = [moment(date1), moment(date2)].sort((a, b) => a.diff(b));

    startDate = sortedDates[0].format("YYYY-MM-DD").toString();
    endDate = sortedDates[1].format("YYYY-MM-DD").toString();
  }

  props.onSubmit({
    projectId: values.projectId,
    workspaceId: values.workspaceId,
    memberId: values.memberId,
    endDate,
    startDate,
  });
});
</script>
