export const useInitialize = () => {
  const { isLoadingUser } = useAuth();

  const isLoading = computed(() => isLoadingUser.value);

  return { isLoading };
};
