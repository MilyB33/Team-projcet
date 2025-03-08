export const useUser = () => {
  const { user } = useAuth();

  // TOOD: change this
  const isEmployer = computed(() => user.value?.typeId === 2);

  return {
    user,
    isEmployer,
  };
};
