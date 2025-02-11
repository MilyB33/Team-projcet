<template>
  <ConfirmDialog
    title="Leave project"
    text="Are you sure you want to leave this project?"
    :anchorProps="{
      size: 'small',
      icon: 'mdi-exit-to-app',
      disabled: leavingProject,
      variant: 'text',
    }"
    :onConfirm="onLeave"
  ></ConfirmDialog>
</template>

<script lang="ts" setup>
type LeaveProjectProps = {
  projectId: number;
};

const props = defineProps<LeaveProjectProps>();

const { leaveProject, leavingProject } = useProjects();

const onLeave = () => {
  leaveProject(props.projectId);
};
</script>
