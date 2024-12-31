import { inject } from "vue";

type SnackbarContext = {
  snackbar: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
  hide: () => void;
};

export const useSnackbar = () => {
  const context = inject<SnackbarContext>("snackbar");

  if (!context) {
    throw new Error("Snackbar used outside the provider");
  }

  return context;
};
