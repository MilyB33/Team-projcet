<template>
  <ReportsFilters
    :onSubmit="setFilters"
    :initial-values="{ memberId: initialMembers }"
  >
    <IDFilterField
      v-if="memberItems?.length"
      :items="memberItems"
      :loading="loading"
      fieldId="memberId"
    />
  </ReportsFilters>
</template>

<script lang="ts" setup>
type UserReportFiltersProps = {
  memberItems: { title: string; value: number }[];
  loading: boolean;
  setFilters: (newFilters: ProjectFilters) => void;
};

const props = defineProps<UserReportFiltersProps>();

const initialMembers = computed(() => props.memberItems?.map((item) => item.value) || []);
</script>
